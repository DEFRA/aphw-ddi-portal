const { errorPusherDefault } = require('../../../lib/error-helpers')

/**
 * @typedef DeletedDetails
 * @property {string} pk
 * @property {string} nameOrReference
 * @property {string} nameOrReferenceText
 */
/**
 * @param {DeletedDetails} details
 * @param backNav
 * @param [errors]
 * @constructor
 */
function ViewModel (details, backNav, errors) {
  this.model = {
    backLink: backNav?.backLink,
    nameOrReference: details.nameOrReference,
    nameOrReferenceText: details.nameOrReferenceText,
    pk: details.pk,
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
