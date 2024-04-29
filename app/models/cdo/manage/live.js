const constants = require('../../../constants/cdo')

const baseMap = {
  live: constants.routes.manage.get,
  expired: constants.routes.manageExpired.get,
  due: constants.routes.manageDue.get,
  interim: constants.routes.manageInterim.get
}
/**
 * @param {'live', 'expired', 'due', 'interim'} tab
 * @param {{
 *  column: 'joinedExemptionScheme'
 *  order: 'ASC'|'DESC'
 * }} sort
 * @param {string} column
 * @return {string}
 */
const getAriaSort = (tab, sort, column) => {
  let calculatedColumn = column

  if (column === undefined) {
    calculatedColumn = tab === 'interim' ? 'interimExemptFor' : 'cdoExpiry'
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
 * @param {'live', 'expired', 'due', 'interim'} tab
 * @param {{
 *  column: 'joinedExemptionScheme'
 *  order: 'ASC'|'DESC'
 * }} sort
 * @param {string} column
 * @return {string}
 */
const columnLink = (tab, sort, column) => {
  const base = baseMap[tab]
  const queryParams = new URLSearchParams()
  let calculatedColumn = column

  if (column === undefined) {
    calculatedColumn = tab === 'interim' ? 'interimExemptFor' : 'cdoExpiry'
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

  return base + queryParamStrWithQM
}
/**
 * @param {SummaryCdo[]} resultList
 * @param {string} tab
 * @param {{ column: string; order: 'ASC'|'DESC'}} sort
 * @param backNav
 * @constructor
 */
function ViewModel (resultList, tab, sort, backNav) {
  const tabs = [
    {
      visible: true,
      active: tab === 'live',
      href: '/cdo/manage',
      label: 'Live CDOs'
    },
    {
      visible: true,
      active: tab === 'expired',
      href: '/cdo/manage/expired',
      label: 'Expired'
    },
    {
      visible: true,
      active: tab === 'due',
      href: '/cdo/manage/due',
      label: 'Due within 30 days'
    }
  ]

  const title = tab === 'interim' ? 'Manage interim exemptions' : 'Manage CDOs'
  let secondaryBtn = {
    label: 'Interim exemptions',
    link: constants.routes.manageInterim.get
  }

  const breadcrumbs = [
    {
      label: 'Home',
      link: '/'
    }
  ]

  if (tab === 'interim') {
    secondaryBtn = {
      label: 'Manage CDOs',
      link: constants.routes.manage.get
    }

    breadcrumbs.push({
      label: 'Manage CDOs',
      link: constants.routes.manage.get
    })
  }

  const tableHeadings = [
    {
      label: tab === 'interim' ? 'Interim exempt for' : 'CDO expiry',
      link: columnLink(tab, sort, undefined),
      ariaSort: getAriaSort(tab, sort, undefined)
    },
    {
      label: 'Index number',
      link: columnLink(tab, sort, 'indexNumber'),
      ariaSort: getAriaSort(tab, sort, 'indexNumber')
    },
    {
      label: 'Owner',
      link: columnLink(tab, sort, 'owner'),
      ariaSort: getAriaSort(tab, sort, 'owner')
    },
    {
      label: 'Police force',
      link: columnLink(tab, sort, 'policeForce'),
      ariaSort: getAriaSort(tab, sort, 'policeForce')
    }
  ]

  this.model = {
    title,
    breadcrumbs,
    showTabNav: tab !== 'interim',
    secondaryBtn,
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    tableHeadings,
    tab,
    tabs,
    sort: {
      column: 'cdoExpiry',
      order: 'ASC',
      ...sort
    },
    resultList
  }
}

module.exports = ViewModel
