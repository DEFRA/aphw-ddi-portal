const constants = require('../../../constants/cdo')
const { mapManageCdoDetails } = require('../../mappers/manage-cdo')
const { errorPusherDefault } = require('../../../lib/error-helpers')

/**
 * @param {CdoDetails[]} details
 * @param backNav
 * @constructor
 */
function ViewModel (details, cdo, backNav, continueLink) {
  const breadcrumbs = [
    {
      label: 'Home',
      link: '/'
    },
    {
      label: 'Manage CDOs',
      link: constants.routes.manage.get
    }
  ]

  this.model = {
    breadcrumbs,
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    details: mapManageCdoDetails(details, cdo),
    continueLink
  }
}

module.exports = ViewModel
