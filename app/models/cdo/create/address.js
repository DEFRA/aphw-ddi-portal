const { forms } = require('../../../constants/forms')
const { errorPusherDefault } = require('../../../lib/error-helpers')
const { mapToCountrySelector } = require('../../mappers/countries')

function ViewModel (address, form, backNav, countries, validationError) {
/**
 * @param {Address} address
 * @param {Form} form
 * @param {BackNav} backNav
 * @param {string[]} countries
 * @param {Joi.ValidationError} [validationError]
 * @constructor
 */
  this.model = {
    backLink: backNav?.backLink,
    buttonText: form.source === 'edit' ? 'Save address' : 'Continue',
    srcHashParam: backNav?.srcHashParam,
    personReference: form?.personReference,
    addressLine1: {
      id: 'addressLine1',
      name: 'addressLine1',
      label: {
        text: 'Address line 1'
      },
      value: address.addressLine1,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '50' }
    },
    addressLine2: {
      id: 'addressLine2',
      name: 'addressLine2',
      label: {
        text: 'Address line 2 (optional)'
      },
      value: address.addressLine2,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '50' }
    },
    town: {
      id: 'town',
      name: 'town',
      label: {
        text: 'Town or city'
      },
      value: address.town,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '50' }
    },
    postcode: {
      id: 'postcode',
      name: 'postcode',
      label: {
        text: 'Postcode'
      },
      value: address.postcode,
      classes: 'govuk-input--width-10',
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '8' }
    },
    country: mapToCountrySelector(countries, validationError, address.country),
    errors: []
  }

  errorPusherDefault(validationError, this.model)
}

module.exports = ViewModel
