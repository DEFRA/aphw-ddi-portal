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
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    tab,
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
