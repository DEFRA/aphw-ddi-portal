const { routes } = require('../../../constants/cdo/owner')
const { forms } = require('../../../constants/forms')
const { mapToCountrySelector } = require('../../mappers/countries')

/**
 * @param {Address} address
 * @param {string[]} countries
 * @param {Joi.ValidationError} [validationError]
 * @constructor
 */
function ViewModel (address, countries, validationError) {
  this.model = {
    formAction: routes.address.get,
    backLink: routes.ownerDetails.get,
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

  if (validationError) {
    for (const error of validationError.details) {
      const name = error.path[0]

      const prop = this.model[name]

      if (prop !== undefined) {
        prop.errorMessage = {
          text: error.message
        }

        this.model.errors.push({
          text: error.message,
          href: `#${name}`
        })
      }
    }
  }
}

module.exports = ViewModel
