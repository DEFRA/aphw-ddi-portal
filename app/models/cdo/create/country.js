const { routes } = require('../../../constants/cdo/owner')
const { mapToCountrySelector } = require('../../mappers/countries')

function ViewModel (countries, payloadError) {
  let errors = []

  if (payloadError) {
    errors = payloadError.details.map(error => {
      let text = error.message

      if (text.includes('country')) {
        text = 'Select a country'
      }
      return { text, href: `#${error.path}` }
    })
  }

  this.model = {
    formAction: routes.country.post,
    backLink: routes.address.get,
    countries: mapToCountrySelector(countries),
    errors
  }
}

module.exports = ViewModel
