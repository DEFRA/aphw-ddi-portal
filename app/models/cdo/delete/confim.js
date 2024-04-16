const { errorPusherDefault } = require('../../../lib/error-helpers')

/**
 * @typedef ConfirmDeleteDetails
 * @property {string} action
 * @property {string} pk
 * @property {string} recordTypeText
 * @property {string} nameOrReferenceText
 * @property {string} confirmReferenceText
 * @property {string} nameOrReference
 */
/**
 * @param {ConfirmDeleteDetails} details
 * @param backNav
 * @param [errors]
 * @constructor
 */
function ViewModel (details, backNav, errors) {
  this.model = {
    backLink: backNav?.backLink,
    confirm: {
      id: 'confirm',
      name: 'confirm',
      classes: 'govuk-!-font-size-16',
      items: [
        {
          text: 'Yes',
          value: 'Y'
        },
        {
          text: 'No',
          value: 'N'
        }
      ]
    },
    confirmText: `Are you sure you want to ${details.action} ${details.recordTypeText} record ${details.confirmReferenceText}?`,
    nameOrReference: details.nameOrReference,
    pk: details.pk,
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
