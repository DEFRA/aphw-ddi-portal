const { routes } = require('../../../constants/owner')

function ViewModel (address, counties, countries, errors) {
  this.model = {
    formAction: routes.address.get,
    backLink: routes.postcode.get,
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
    county: {
      id: 'county',
      name: 'county',
      label: {
        text: 'County'
      },
      value: address.county,
      items: counties.map(county => ({
        value: county,
        text: county,
      })),
      autocomplete: 'addressCounty'
    },
    postcode: {
      id: 'postcode',
      name: 'postcode',
      label: {
        text: 'Postcode'
      },
      value: address.postcode,
      autocomplete: 'postal-code'
    },
    country: {
      id: 'country',
      name: 'country',
      label: {
        text: 'Country'
      },
      value: address.country,
      items: countries.map(country => ({
        value: country,
        text: country,
      })),
      autocomplete: 'addressCountry'
    },
    errors: []
  }

  if (errors) {
    console.dir(errors, { depth: null })
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
