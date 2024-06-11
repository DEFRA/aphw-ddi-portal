/**
 * @typedef GetAriaSortFn
 * @param {{
 *   column: string
 *   order: 'ASC'|'DESC'
 *  }} sort
 *  @param {string} column
 *  @return {string}
 */
/**
 * @param {string} defaultColumn
 * @return {GetAriaSortFn}
 */
const getAriaSortBuilder = (defaultColumn) => (sort, column) => {
  let calculatedColumn = column

  if (column === undefined) {
    calculatedColumn = defaultColumn
  }

  if (calculatedColumn === sort.column && sort.order === 'DESC') {
    return 'descending'
  }

  if (calculatedColumn === sort.column) {
    return 'ascending'
  }

  return 'none'
}

const columnLinkBuilder = (defaultColumn) => (sort, column) => {
  const queryParams = new URLSearchParams()

  if (column === undefined) {
    column = defaultColumn
  }

  queryParams.set('sortKey', column)

  queryParams.set('sortOrder', sort.order === 'ASC' && column === sort.column ? 'DESC' : 'ASC')

  return `?${queryParams.toString()}`
}

module.exports = {
  getAriaSortBuilder,
  columnLinkBuilder
}
