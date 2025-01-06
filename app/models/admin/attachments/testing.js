const { errorPusherDefault } = require('../../../lib/error-helpers')
const { forms } = require('../../../constants/forms')

function ViewModel (payload, validationError) {
  this.model = {
    backLink: '/admin/attachments/list',
    ddi_index_number: {
      id: 'ddi_index_number',
      name: 'ddi_index_number',
      label: {
        text: 'ddi_index_number'
      },
      value: payload?.ddi_index_number,
      classes: 'govuk-input govuk-!-width-one-third',
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '254' }
    },
    errors: []
  }

  errorPusherDefault(validationError, this.model)
}

module.exports = ViewModel
