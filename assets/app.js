let shifted = false
const drawMain = (rows) => {
  renderMain(rows)
  updateCount()
}
const generateDefaultMain = (rowCount, colCount) => {
  let rows = []
  for (let irow = 0; irow < rowCount; irow++) {
    let row = []
    for (let icol = 0; icol < colCount; icol++) {
      let type = 0
      row.push(type)
    }
    rows.push(row)
  }
  return rows
}
const renderMain = (rows) => {
  $('.main').html(render('#tmpl-main', rows))
  bindMainClicks()
}
const bindMainClicks = () => {
  $('.cell').click(function () {
    let current = parseInt($(this).attr('data-type'))
    let next = current > 4 || shifted ? 0 : current + 1
    console.log('click', current, next, shifted)
    $(this).attr('data-type', next)
    updateCount()
    generateSaveUrl()
  })
  new DragSelect({
    selectables: document.querySelectorAll('.cell'),
    callback: e => {
      $(e).click()
    }
  })
}
const updateCount = () => {
  let ship = $('.cell[data-type="1"]').length + $('.cell[data-type="3"]').length
  let engine = $('.cell[data-type="2"]').length
  let upgrade = $('.cell[data-type="4"]').length + $('.cell[data-type="5"]').length
  renderCount({ship: ship, engine: engine, upgrade: upgrade})
}
const renderCount = (data) => {
  console.log('count data', data)
  $('.count').html(render('#tmpl-count', data))
}
const render = (tmpl, data) => {
  let source = $(tmpl).html()
  let template = Handlebars.compile(source)
  return template(data)
}
const capture = () => {
  console.log('capture')
  let cellCount = $('.main .row').first().find('.cell').length // Need to explicitly set width for smaller image as i'm using rows...
  let cellWidth = $('.main .row .cell').first().outerWidth()
  let size = cellCount * cellWidth
  $('.main').width(size)
  console.log('cell', cellCount, cellWidth, size)
  html2canvas(document.querySelector('.main')).then(function (canvas) {
    $('.image').html(canvas)
  })
  $('.main')
}
const bindActionClicks = () => {
  $('.create-image').click(function () {
    capture()
  })
  $('.reset').click(function () {
    let url = window.location.href.substr(0, window.location.href.indexOf('#'))
    window.location.href = url
  })
  $('.row-add').click(function () {
    rowAdd()
  })
  $('.row-remove').click(function () {
    rowRemove()
  })
  $('.col-add').click(function () {
    colAdd()
  })
  $('.col-remove').click(function () {
    colRemove()
  })
}
const colAdd = () => {
  let rows = getRowsData()
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    row.push(0)
  }
  updateGrid(rows)
}
const colRemove = () => {
  let rows = getRowsData()
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    row.pop()
  }
  updateGrid(rows)
}
const rowAdd = () => {
  let rows = getRowsData()
  let colCount = rows[0].length
  let row = []
  for (let i = 0; i < colCount; i++) {
    row.push(0)
  }
  rows.push(row)
  updateGrid(rows)
}
const rowRemove = () => {
  let rows = getRowsData()
  rows.pop()
  updateGrid(rows)
}
const updateGrid = (rows) => {
  let rowsString = rows[0].length + '_'
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    for (let j = 0; j < row.length; j++) {
      const col = row[j]
      rowsString = rowsString + col
    }
  }
  window.location.hash = LZString.compressToEncodedURIComponent(rowsString)
  window.location.reload()
}
const getRowsData = () => {
  let rows = []
  $('.main .row').each(function () {
    let row = []
    $(this).find('.cell').each(function () {
      row.push(parseInt($(this).attr('data-type')))
    })
    rows.push(row)
  })
  // console.log('getRowsData', rows)
  return rows
}

const generateSaveUrl = () => {
  let rowsString = $('.main .row').length + '_'
  $('.main .cell').each(function () {
    rowsString = rowsString + $(this).attr('data-type')
  })
  window.location.hash = LZString.compressToEncodedURIComponent(rowsString)
}
const getState = () => {
  try {
    let hash = window.location.hash.substring(1)
    let decoded = LZString.decompressFromEncodedURIComponent(hash)
    let rowCount = decoded.split('_')[0]
    let cellString = decoded.split('_')[1]
    let rowsString = cellString.match(new RegExp('.{1,' + rowCount + '}', 'g'))
    let rows = []
    for (let i = 0; i < rowsString.length; i++) {
      const rowString = rowsString[i]
      let row = rowString.split(/(?!$)/u)
      // console.log('row', row)
      rows.push(row)
    }
    let data = {rows: rows, rowCount: rows.length, colCount: rows[0].length}
    console.log('get state', data)
    return data
  } catch (error) {
    console.log('error', error)
    let rowCount = 13
    let colCount = 13
    let rows = generateDefaultMain(rowCount, colCount)
    let data = {rows: rows, rowCount: rows.length, colCount: rows[0].length}
    console.log('default state', data)
    return data
  }
}
$(document).ready(function () {
  let data = getState()
  drawMain(data.rows)
  $(document).on('keyup keydown', function (e) { shifted = e.shiftKey })
  bindActionClicks()
})
