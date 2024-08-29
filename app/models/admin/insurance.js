const { errorPusherDefault } = require('../../lib/error-helpers')
const { forms } = require('../../constants/forms')

/**
 * @param payload
 * @param {InsuranceCompany[]} insuranceCompanies
 * @param [validationError]
 * @constructor
 */
function ViewModel (payload, insuranceCompanies, validationError) {
  this.model = {
    title: insuranceCompanies.length ? 'Add or remove dog insurers' : 'Add a dog insurer',
    backLink: '/admin/index',
    insuranceCompanies: insuranceCompanies,
    name: {
      id: 'name',
      name: 'name',
      label: {
        text: 'Name'
      },
      hint: {
        html: 'Enter an insurer name using capital letters, for<br>example AXA Insurance, Dogs Trust.'
      },
      value: payload?.name,
      classes: 'govuk-input govuk-!-width-one-third',
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '254' }
    },
    errors: []
  }

  errorPusherDefault(validationError, this.model)
}

module.exports = ViewModel
