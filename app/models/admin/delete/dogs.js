const { breadcrumbs } = require('../../../constants/admin')
const { formatToGds } = require('../../../lib/date-helpers')

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

  if (column === undefined) {
    column = 'status'
  }

  queryParams.set('sortKey', column)

  queryParams.set('sortOrder', sort.order === 'ASC' && column === sort.column ? 'DESC' : 'ASC')

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
      link: columnLink(sort, 'dateOfBirth'),
      ariaSort: getAriaSort(sort, 'dateOfBirth')
    },
    {
      label: 'CDO issued',
      link: columnLink(sort, 'cdoIssued'),
      ariaSort: getAriaSort(sort, 'cdoIssued')
    }
  ]

  const rows = resultList.map(row => ({
    ...row,
    humanReadableCdoIssued: formatToGds(row.cdoIssued),
    humanReadableBirthDate: formatToGds(row.dateOfBirth)
  }))

  this.model = {
    breadcrumbs,
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    tableHeadings,
    sort: {
      column: 'status',
      order: 'ASC',
      ...sort
    },
    resultList: rows
  }
}

module.exports = {
  ViewModel,
  getAriaSort,
  columnLink
}
