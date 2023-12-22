const { routes: searchRoutes } = require('../../../constants/search')
const { routes: otherRoutes } = require('../../../constants/owner')
const { forms } = require('../../../constants/forms')

function ViewModel (searchCriteria, resultList, errors) {
  this.model = {
    formAction: searchRoutes.searchBasic.get,
    backLink: otherRoutes.home.get,
    searchTerms: {
      hint: {
        text: 'Enter one or more search terms separated by spaces'
      },
      id: 'searchTerms',
      name: 'searchTerms',
      classes: 'govuk-input--width-20',
      value: searchCriteria?.searchTerms,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '100' }
    },
    searchType: {
      id: 'searchType',
      name: 'searchType',
      classes: 'govuk-radios--small govuk-radios--inline',
      value: searchCriteria?.searchType,
      items: [
        {
          value: 'dog',
          text: 'Dog record',
          label: {
            classes: 'govuk-!-font-size-16'
          }
        },
        {
          value: 'owner',
          text: 'Owner record',
          label: {
            classes: 'govuk-!-font-size-16'
          }
        }
      ]
    },
    results: {
      items: resultList || []
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
