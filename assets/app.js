let shifted = false
const drawMain = (rowCount, colCount) => {
  let rows = []
  for (let irow = 0; irow < rowCount; irow++) {
    let row = []
    for (let icol = 0; icol < colCount; icol++) {
      let type = 0
      row.push(type)
    }
    rows.push(row)
  }
  renderMain(rows)
  updateCount()
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
    console.log('capture complete')
    // document.body.appendChild(canvas)
    $('.image').html(canvas)
  })
  $('.main')
}
const bindActionClicks = () => {
  $('.create-image').click(function () {
    console.log('create-image click')
    capture()
  })
}
const getGridSize = () => {
  let row = 20
  let col = 20
  try {
    let url = new URL(window.location.href)
    let parseRow = parseInt(url.searchParams.get('row'))
    let parseCol = parseInt(url.searchParams.get('col'))
    if (!isNaN(parseRow)) {
      row = parseRow
    }
    if (!isNaN(parseCol)) {
      col = parseCol
    }
  } catch (error) {

  }
  console.log('row col', row, col)
  return {row: row, col: col}
}
$(document).ready(function () {
  let grid = getGridSize()
  drawMain(grid.row, grid.col)
  $(document).on('keyup keydown', function (e) { shifted = e.shiftKey })
  bindActionClicks()
})
