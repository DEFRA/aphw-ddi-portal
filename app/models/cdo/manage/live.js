const { errorPusherDefault } = require('../../../lib/error-helpers')

/**
 * @param {SummaryCdo[]} resultList
 * @param {string} tab
 * @param {{ column: string; order: 'ASC'|'DESC'}} sort
 * @param backNav
 * @param [errors]
 * @constructor
 */
function ViewModel (resultList, tab, sort, backNav, errors) {
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
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    tabs,
    sort: {
      column: 'cdoExpiry',
      order: 'ASC',
      ...sort
    },
    resultList,
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
