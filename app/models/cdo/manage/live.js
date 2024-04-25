const constants = require('../../../constants/cdo')

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
      visible: false,
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

  if (tab === 'interim') {
    secondaryBtn = {
      label: 'Manage CDOs',
      link: constants.routes.manage.get
    }
  }
  this.model = {
    title,
    showTabNav: tab !== 'interim',
    secondaryBtn,
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
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
