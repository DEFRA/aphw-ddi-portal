const { breadcrumbs } = require('../../../constants/admin')
const { formatToGds } = require('../../../lib/date-helpers')
const { getAriaSortBuilder, columnLinkBuilder } = require('../../sorting')

/**
 * @param {{
 *  column: 'status'
 *  order: 'ASC'|'DESC'
 * }} sort
 * @param {string} column
 * @return {string}
 */
const getAriaSort = getAriaSortBuilder('status')

/**
 * @param {{
 *  column: 'joinedExemptionScheme'
 *  order: 'ASC'|'DESC'
 * }} sort
 * @param {string} column
 * @return {string}
 */
const columnLink = columnLinkBuilder('status')

/**
 * @param {Dog[]} resultList
 * @param selectedList
 * @param {{ column: string; order: 'ASC'|'DESC'}} sort
 * @param backNav
 * @constructor
 */
function ViewModel (resultList, selectedList, sort, backNav) {
  const tableHeadings = [
    {
      label: 'Status',
      link: columnLink(sort, undefined),
      ariaSort: getAriaSort(sort, undefined),
      name: 'status'
    },
    {
      label: 'Index number',
      link: columnLink(sort, 'indexNumber'),
      ariaSort: getAriaSort(sort, 'indexNumber'),
      name: 'indexNumber'
    },
    {
      label: 'Date of birth',
      link: columnLink(sort, 'dateOfBirth'),
      ariaSort: getAriaSort(sort, 'dateOfBirth'),
      name: 'dateOfBirth'
    },
    {
      label: 'CDO issued',
      link: columnLink(sort, 'cdoIssued'),
      ariaSort: getAriaSort(sort, 'cdoIssued'),
      name: 'cdoIssued'
    },
    {
      label: 'Delete dog record',
      link: columnLink(sort, 'selected'),
      ariaSort: getAriaSort(sort, 'selected'),
      name: 'selected'
    }
  ]

  const rows = resultList.map(row => ({
    ...row,
    humanReadableCdoIssued: formatToGds(row.cdoIssued),
    humanReadableBirthDate: formatToGds(row.dateOfBirth),
    selected: selectedList.some(elem => elem === row.indexNumber)
  }))

  this.model = {
    breadcrumbs,
    backLink: backNav?.backLink,
    srcHashParam: backNav.srcHashParam,
    srcHashParamStripped: backNav.srcHashParam ? backNav.srcHashParam.substr(5) : '',
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
