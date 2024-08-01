const { forms } = require('../../../constants/forms')
const { errorPusherDefault } = require('../../../lib/error-helpers')

function ViewModel (data, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    queryString: data.queryString,
    personReference: data.personReference,
    postcode: {
      label: {
        text: 'Postcode'
      },
      id: 'postcode',
      name: 'postcode',
      classes: 'govuk-input--width-10',
      value: data?.postcode,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '8' }
    },
    houseNumber: {
      label: {
        text: 'Property name or number (optional)'
      },
      hint: {
        text: 'For example, \'The Mill\', \'116\' or \'Flat 36a\''
      },
      id: 'houseNumber',
      name: 'houseNumber',
      classes: 'govuk-input--width-5',
      value: data?.houseNumber,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '50' }
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
