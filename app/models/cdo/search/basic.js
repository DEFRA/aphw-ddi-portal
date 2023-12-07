const { routes: searchRoutes } = require('../../../constants/search')
const { routes: otherRoutes } = require('../../../constants/owner')
const { forms } = require('../../../constants/forms')

function ViewModel (searchCriteria, results, errors) {
  this.model = {
    formAction: searchRoutes.searchBasic.get,
    backLink: otherRoutes.home.get,
    searchTerms: {
      label: {
        text: 'Search terms'
      },
      id: 'searchTerms',
      name: 'searchTerms',
      classes: 'govuk-input--width-20',
      value: searchCriteria?.terms,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '100' }
    },
    searchType: {
      label: {
        text: 'Type'
      },
      id: 'searchOptions',
      name: 'searchOptions',
      classes: 'govuk-radios--small govuk-radios--inline',
      value: searchCriteria?.searchType,
      items: [
        {
          value: 'dog',
          text: 'Dog'
        },
        {
          value: 'owner',
          text: 'Owner'
        }
      ]
    },
    results: {
      items: results || []
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
