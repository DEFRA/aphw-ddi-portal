const { errorPusherDefault } = require('../../lib/error-helpers')
const { forms } = require('../../constants/forms')

/**
 * @typedef AddOrRemoveDetails
 * @property {string} recordType
 * @property {string} recordTypeText
 * @property {string} buttonText
 * @property {string} [optionText]
 * @property {string} [recordValue]
 * @property {string} [backLink]
 * @property {'add'|'remove'} action
 */

/**
 * @param {AddOrRemoveDetails} details
 * @param [backNav]
 * @param [errors]
 * @constructor
 */
function ViewModel (details, backNav, errors) {
  const inputModel = {
    label: {
      text: details.optionText ?? `What is the name of the ${details.recordTypeText} you want to ${details.action}?`,
      classes: 'govuk-label--l',
      isPageHeading: true
    },
    id: details.recordType,
    name: details.recordType,
    value: details.recordValue ?? null,
    autocomplete: forms.preventAutocomplete
  }

  this.model = {
    backLink: details.backLink ?? backNav?.backLink,
    get govukInput () {
      return this[details.recordType]
    },
    [details.recordType]: inputModel,
    buttonText: details.buttonText,
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
