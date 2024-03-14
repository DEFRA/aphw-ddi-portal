const { forms } = require('../../../constants/forms')

function ViewModel (searchCriteria, resultList, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
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
