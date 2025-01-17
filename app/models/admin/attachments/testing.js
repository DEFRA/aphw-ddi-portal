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
    ddi_dog_name: {
      id: 'ddi_dog_name',
      name: 'ddi_dog_name',
      label: {
        text: 'ddi_dog_name'
      },
      value: payload?.ddi_dog_name,
      classes: 'govuk-input govuk-!-width-one-third',
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '254' }
    },
    ddi_owner_name: {
      id: 'ddi_owner_name',
      name: 'ddi_owner_name',
      label: {
        text: 'ddi_owner_name'
      },
      value: payload?.ddi_owner_name,
      classes: 'govuk-input govuk-!-width-one-third',
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '254' }
    },
    ddi_address_line_1: {
      id: 'ddi_address_line_1',
      name: 'ddi_address_line_1',
      label: {
        text: 'ddi_address_line_1'
      },
      value: payload?.ddi_address_line_1,
      classes: 'govuk-input govuk-!-width-one-third',
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '254' }
    },
    ddi_address_line_2: {
      id: 'ddi_address_line_2',
      name: 'ddi_address_line_2',
      label: {
        text: 'ddi_address_line_2'
      },
      value: payload?.ddi_address_line_2,
      classes: 'govuk-input govuk-!-width-one-third',
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '254' }
    },
    ddi_town: {
      id: 'ddi_town',
      name: 'ddi_town',
      label: {
        text: 'ddi_town'
      },
      value: payload?.ddi_town,
      classes: 'govuk-input govuk-!-width-one-third',
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '254' }
    },
    ddi_postcode: {
      id: 'ddi_postcode',
      name: 'ddi_postcode',
      label: {
        text: 'ddi_postcode'
      },
      value: payload?.ddi_postcode,
      classes: 'govuk-input govuk-!-width-one-third',
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '254' }
    },
    ddi_todays_date: {
      id: 'ddi_todays_date',
      name: 'ddi_todays_date',
      label: {
        text: 'ddi_todays_date'
      },
      value: payload?.ddi_todays_date,
      classes: 'govuk-input govuk-!-width-one-third',
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '254' }
    },
    errors: []
  }

  errorPusherDefault(validationError, this.model)
}

module.exports = ViewModel
