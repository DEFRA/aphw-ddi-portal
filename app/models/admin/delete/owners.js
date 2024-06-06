const { breadcrumbs } = require('../../../constants/admin')
const { formatToGds } = require('../../../lib/date-helpers')
const { formatAddressSingleLine } = require('../../../lib/format-helpers')

/**
 * @param {{
 *  column: 'name'|'dateOfBirth'|'address'
 *  order: 'ASC'|'DESC'
 * }} sort
 * @param {string} column
 * @return {string}
 */
const getAriaSort = (sort, column) => {
  let calculatedColumn = column

  if (column === undefined) {
    calculatedColumn = 'owner'
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
    column = 'owner'
  }

  queryParams.set('sortKey', column)

  queryParams.set('sortOrder', sort.order === 'ASC' && column === sort.column ? 'DESC' : 'ASC')

  const queryParamsStr = queryParams.toString()

  return queryParamsStr.length ? `?${queryParamsStr}` : ''
}

/**
 * @param {Person[]} resultList
 * @param selectedList
 * @param {{ column: string; order: 'ASC'|'DESC'}} sort
 * @param backNav
 * @constructor
 */
function SelectOwnersViewModel (resultList, selectedList, sort, backNav) {
  const tableHeadings = [
    {
      label: 'Name',
      link: columnLink(sort, undefined),
      ariaSort: getAriaSort(sort, undefined)
    },
    {
      label: 'Date of birth',
      link: columnLink(sort, undefined),
      // link: columnLink(sort, 'birthDate'),
      ariaSort: getAriaSort(sort, 'dateOfBirth')
    },
    {
      label: 'Address',
      link: columnLink(sort, undefined),
      // link: columnLink(sort, 'address'),
      ariaSort: getAriaSort(sort, 'address')
    },
    {
      label: 'Delete owner record',
      link: columnLink(sort, undefined),
      // link: columnLink(sort, 'selected'),
      ariaSort: getAriaSort(sort, 'selected')
    }
  ]

  const rows = resultList.map(row => ({
    ...row,
    name: [row.firstName, row.lastName].filter(Boolean).join(' '),
    humanReadableBirthDate: formatToGds(row.birthDate),
    address: formatAddressSingleLine(row.address, true),
    selected: selectedList.some(elem => elem === row.personReference)
  }))

  this.model = {
    breadcrumbs,
    backLink: backNav?.backLink,
    tableHeadings,
    sort: {
      column: 'name',
      order: 'ASC',
      ...sort
    },
    resultList: rows
  }
}

module.exports = {
  SelectOwnersViewModel,
  getAriaSort,
  columnLink
}
