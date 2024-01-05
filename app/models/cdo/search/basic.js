const { routes: searchRoutes } = require('../../../constants/search')
const { forms } = require('../../../constants/forms')
const { addBackNavigation } = require('../../../lib/back-helpers')

function ViewModel (searchCriteria, resultList, request, errors) {
  this.model = {
    formAction: searchRoutes.searchBasic.get,
    searchTerms: {
      hint: {
        text: 'Enter one or more search terms separated by spaces'
      },
      id: 'searchTerms',
      name: 'searchTerms',
      formGroup: {
        classes: 'govuk-!-margin-bottom-2'
      },
      value: searchCriteria?.searchTerms,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '100' }
    },
    searchType: {
      id: 'searchType',
      name: 'searchType',
      classes: 'govuk-radios--small govuk-radios--inline',
      formGroup: {
        classes: 'govuk-!-margin-bottom-2'
      },
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

  addBackNavigation(this.model, request)

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
