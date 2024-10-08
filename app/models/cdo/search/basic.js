const { forms } = require('../../../constants/forms')
const { errorPusherDefault } = require('../../../lib/error-helpers')

const marginBottom2 = 'govuk-!-margin-bottom-2'

function ViewModel (searchCriteria, results, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    searchTerms: {
      label: {
        text: 'Search',
        classes: 'govuk-label--m',
        isPageHeading: true
      },
      id: 'searchTerms',
      name: 'searchTerms',
      formGroup: {
        classes: marginBottom2
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
        classes: marginBottom2
      },
      value: searchCriteria?.searchType,
      items: [
        {
          value: 'dog',
          text: 'Dog record',
          label: {
            classes: 'govuk-!-font-size-16 defra-max-width-full'
          }
        },
        {
          value: 'owner',
          text: 'Owner record',
          label: {
            classes: 'govuk-!-font-size-16 defra-max-width-full'
          }
        }
      ]
    },
    fuzzy: {
      id: 'fuzzy',
      name: 'fuzzy',
      items: [
        {
          value: 'Y',
          text: 'Include close matches',
          checked: searchCriteria?.fuzzy,
          label: {
            classes: 'govuk-!-font-size-16'
          }
        }
      ],
      classes: 'govuk-checkboxes--small',
      formGroup: {
        classes: marginBottom2
      }
    },
    results: {
      items: results?.results?.map(resultObj => ({
        ...resultObj,
        dogs: resultObj.dogs?.map(dog => ({
          ...dog,
          dogNameNotEntered: !dog.dogName?.length
        })),
        dogNameNotEntered: !resultObj.dogName?.length,
        microchipNumberNotEntered: !resultObj.microchipNumber?.length
      })) || []
    },
    totalFound: results?.totalFound,
    fuzzySearchUrl: searchCriteria.fuzzySearchUrl,
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
