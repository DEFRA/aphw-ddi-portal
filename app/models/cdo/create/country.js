const { routes } = require('../../../constants/cdo/owner')
const { mapToCountrySelector } = require('../../mappers/countries')

function ViewModel (countries) {
  this.model = {
    formAction: routes.country.post,
    backLink: routes.address.get,
    countries: mapToCountrySelector(countries)
  }
}

module.exports = ViewModel
