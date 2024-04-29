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
 */
const columnLink = (tab, sort, column) => {
  const base = baseMap[tab]
  const queryParams = new URLSearchParams()

  if (column !== 'cdoExpiry' && column !== 'joinedExemptionScheme') {
    queryParams.set('sortKey', column)
  }

  if (column === sort.column && sort.order === 'ASC') {
    queryParams.set('sortOrder', 'DESC')
  }

  const queryParamsStr = queryParams.toString()
  const queryParamStrWithQM = queryParamsStr.length ? `?${queryParamsStr}` : ''
  console.log('~~~~~~ Chris Debug ~~~~~~ b', 'Base, queryParamStrWithQM', base, queryParamStrWithQM)
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
      link: columnLink(tab, sort, tab === 'interim' ? 'joinedExemptionScheme' : 'cdoExpiry'),
      sortActive: 'ASC'
    },
    {
      label: 'Index number',
      link: columnLink(tab, sort, 'indexNumber'),
      sortActive: undefined
    },
    {
      label: 'Owner',
      link: columnLink(tab, sort, 'owner'),
      sortActive: undefined
    },
    {
      label: 'Police force',
      link: columnLink(tab, sort, 'policeForce'),
      sortActive: undefined
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
