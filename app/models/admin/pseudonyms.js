const { errorPusherDefault } = require('../../lib/error-helpers')
const { forms } = require('../../constants/forms')

/**
 * @param payload
 * @param {MappedUser[]} pseudonyms
 * @param [validationError]
 * @constructor
 */
function ViewModel (payload, pseudonyms, validationError) {
  this.model = {
    title: pseudonyms.length ? 'Add or remove pseudonyms' : 'Add a team member pseudonym',
    backLink: '/admin/index',
    pseudonyms,
    email: {
      id: 'email',
      name: 'email',
      label: {
        text: 'Email'
      },
      value: payload?.email,
      classes: 'govuk-input govuk-!-width-one-half',
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '254' }
    },
    addFieldset: {
      legend: {
        text: 'Add a team member pseudonym',
        classes: pseudonyms.length === 0 ? 'govuk-fieldset__legend--l' : 'govuk-fieldset__legend--m',
        isPageHeading: pseudonyms.length === 0
      }
    },
    pseudonym: {
      id: 'pseudonym',
      name: 'pseudonym',
      label: {
        text: 'Pseudonym'
      },
      value: payload?.pseudonym,
      classes: 'govuk-input govuk-!-width-one-third',
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '254' }
    },
    errors: []
  }

  errorPusherDefault(validationError, this.model)
}

module.exports = ViewModel
