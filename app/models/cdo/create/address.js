const { routes } = require('../../../constants/owner')

function ViewModel (address, countries, errors) {
  this.model = {
    formAction: routes.address.get,
    backLink: `${routes.ownerDetails.get}#postcode`,
    addressLine1: {
      id: 'addressLine1',
      name: 'addressLine1',
      label: {
        text: 'Address Line 1'
      },
      value: address.addressLine1,
      autocomplete: 'address-line1'
    },
    addressLine2: {
      id: 'addressLine2',
      name: 'addressLine2',
      label: {
        text: 'Address Line 2 (optional)'
      },
      value: address.addressLine2,
      autocomplete: 'address-line1'
    },
    town: {
      id: 'town',
      name: 'town',
      label: {
        text: 'Town or city'
      },
      value: address.town,
      autocomplete: 'address-level2'
    },
    postcode: {
      id: 'postcode',
      name: 'postcode',
      label: {
        text: 'Postcode'
      },
      value: address.postcode,
      autocomplete: 'postal-code',
      classes: 'govuk-input--width-10'
    },
    country: {
      id: 'country',
      name: 'country',
      label: {
        text: 'Country'
      },
      value: address.country,
      items: countries.map(country => ({
        value: country.substr(0, 1),
        text: country
      })),
      autocomplete: 'addressCountry',
      fieldset: {
        legend: {
          text: 'Country',
          isPageHeading: false
        }
      },
      classes: 'govuk-radios--inline'
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
