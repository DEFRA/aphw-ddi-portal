const { routes } = require('../../../constants/cdo/owner')
const { forms } = require('../../../constants/forms')

function ViewModel (data, backNav, errors) {
  this.model = {
    formAction: routes.postcodeLookup.post,
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
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

  if (errors) {
    for (const error of errors.details) {
      const name = error.path[0] ?? error.context.path[0]
      const prop = this.model[name]

      if (prop) {
        prop.errorMessage = { text: error.message }
        this.model.errors.push({ text: error.message, href: `#${name}` })
      }
    }
  }
}

module.exports = ViewModel
