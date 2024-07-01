const constants = require('../../../constants/cdo')
const { mapManageCdoDetails } = require('../../mappers/manage-cdo')

/**
 * @param {CdoDetails[]} details
 * @param backNav
 * @constructor
 */
function ViewModel (details, cdo, backNav) {
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
    details: mapManageCdoDetails(details, cdo)
  }
}

module.exports = ViewModel
