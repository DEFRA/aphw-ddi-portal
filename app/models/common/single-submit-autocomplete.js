const { errorPusherDefault } = require('../../lib/error-helpers')
const { forms } = require('../../constants/forms')
/**
 * @typedef AutoCompleteItem
 * @property {string} text
 * @property {string|null} value
 */

/**
 * @typedef AddOrRemoveDetails
 * @property {string} recordType
 * @property {string} recordTypeText
 * @property {string} buttonText
 * @property {string} pk
 * @property {AutoCompleteItem[]} items
 * @property {string} [optionText]
 * @property {string} [recordText]
 * @property {string} [recordId]
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
      text: details.optionText ?? `Which ${details.recordTypeText} do you want to ${details.action}?`,
      classes: 'govuk-label--l',
      isPageHeading: true
    },
    id: 'pk',
    name: 'pk',
    value: details.pk,
    placeholder: `Start typing to choose ${details.recordTypeText}`,
    items: [{ text: '', value: null }, ...details.items],
    autocomplete: forms.preventAutocomplete
  }
  this.model = {
    backLink: details.backLink ?? backNav?.backLink,
    get govukAutoComplete () {
      return this.pk
    },
    pk: inputModel,
    buttonText: details.buttonText,
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
