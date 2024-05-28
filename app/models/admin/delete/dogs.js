/**
 * @param {{
 *  column: 'status'
 *  order: 'ASC'|'DESC'
 * }} sort
 * @param {string} column
 * @return {string}
 */
const getAriaSort = (sort, column) => {
  let calculatedColumn = column

  if (column === undefined) {
    calculatedColumn = 'status'
  }

  if (calculatedColumn === sort.column && sort.order === 'DESC') {
    return 'descending'
  }

  if (calculatedColumn === sort.column) {
    return 'ascending'
  }

  return 'none'
}
/**
 * @param {{
 *  column: 'joinedExemptionScheme'
 *  order: 'ASC'|'DESC'
 * }} sort
 * @param {string} column
 * @return {string}
 */
const columnLink = (sort, column) => {
  const queryParams = new URLSearchParams()
  let calculatedColumn = column

  if (column === undefined) {
    calculatedColumn = 'status'
  }

  const defaultSortOrder = calculatedColumn === 'interimExemptFor' ? ['DESC', 'ASC'] : ['ASC', 'DESC']

  if (calculatedColumn !== 'cdoExpiry' && calculatedColumn !== 'interimExemptFor') {
    queryParams.set('sortKey', calculatedColumn)
  }

  if (calculatedColumn === sort.column && sort.order === defaultSortOrder[0]) {
    queryParams.set('sortOrder', defaultSortOrder[1])
  }

  const queryParamsStr = queryParams.toString()
  const queryParamStrWithQM = queryParamsStr.length ? `?${queryParamsStr}` : ''

  return queryParamStrWithQM
}
/**
 * @param {Dog[]} resultList
 * @param {{ column: string; order: 'ASC'|'DESC'}} sort
 * @param backNav
 * @constructor
 */
function ViewModel (resultList, sort, backNav) {
  const tableHeadings = [
    {
      label: 'Status',
      link: columnLink(sort, undefined),
      ariaSort: getAriaSort(sort, undefined)
    },
    {
      label: 'Index number',
      link: columnLink(sort, 'indexNumber'),
      ariaSort: getAriaSort(sort, 'indexNumber')
    },
    {
      label: 'Date of birth',
      link: columnLink(sort, 'birthDate'),
      ariaSort: getAriaSort(sort, 'birthDate')
    },
    {
      label: 'CDO issued',
      link: columnLink(sort, 'cdoIssued'),
      ariaSort: getAriaSort(sort, 'cdoIssued')
    }
  ]

  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    tableHeadings,
    sort: {
      column: 'status',
      order: 'ASC',
      ...sort
    },
    resultList
  }
}

module.exports = ViewModel
