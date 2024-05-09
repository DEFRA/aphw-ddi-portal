const { errorPusherDefault } = require('../../lib/error-helpers')

/**
 * @typedef ConfirmDetails
 * @property {string} action
 * @property {string} nameOrReferenceText
 * @property {string} confirmReferenceText
 * @property {string} nameOrReference
 * @property {string} [recordTypeText]
 * @property {string} [pk]
 * @property {string} [recordValue]
 * @property {string} [backlink]
 * @property {string} [confirmText]
 */
/**
 * @param {ConfirmDetails} details
 * @param [backNav]
 * @param [errors]
 * @constructor
 */
function ViewModel (details, backNav, errors) {
  const inputReference = details.nameOrReference ?? 'recordValue'
  this.model = {
    backLink: details.backLink ?? backNav?.backLink,
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
    confirmText: details.confirmText ?? `Are you sure you want to ${details.action} ${details.recordTypeText} record ${details.confirmReferenceText}?`,
    confirmHint: details.confirmHint,
    nameOrReference: details.nameOrReference,
    nameOrReferenceText: details.nameOrReferenceText,
    pk: details.pk,
    inputReference,
    [inputReference]: details.recordValue,
    get inputValue () {
      return this[inputReference]
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
