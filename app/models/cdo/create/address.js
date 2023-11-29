const { routes } = require('../../../constants/owner')
const { forms } = require('../../../constants/forms')

function ViewModel (address, countries, errors) {
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
    country: {
      id: 'country',
      name: 'country',
      label: {
        text: 'Country'
      },
      value: address.country,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '30' }
    },
    errors: []
  }

  if (errors) {
    for (const error of errors.details) {
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
