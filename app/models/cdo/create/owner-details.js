const { routes } = require('../../../constants/cdo/owner')
const { forms } = require('../../../constants/forms')
const { errorPusherWithDate } = require('../../../lib/error-helpers')

function ViewModel (ownerDetails, errors) {
  this.model = {
    backLink: routes.home.get,
    addressRoute: routes.address.get,
    firstName: {
      label: {
        text: 'First name'
      },
      id: 'firstName',
      name: 'firstName',
      classes: 'govuk-input--width-20',
      value: ownerDetails?.firstName,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '30' }
    },
    lastName: {
      label: {
        text: 'Last name'
      },
      id: 'lastName',
      name: 'lastName',
      classes: 'govuk-input--width-20',
      value: ownerDetails?.lastName,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '24' }
    },
    dateOfBirth: {
      id: 'dateOfBirth',
      namePrefix: 'dateOfBirth',
      fieldset: {
        legend: {
          text: 'Date of birth (optional)',
          isPageHeading: false,
          classes: 'govuk-input--width-20'
        }
      },
      hint: {
        text: 'For example, 27 3 1987'
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2',
          value: ownerDetails['dateOfBirth-day'],
          label: 'Day',
          autocomplete: forms.preventAutocomplete,
          attributes: { maxlength: '2' }
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2',
          value: ownerDetails['dateOfBirth-month'],
          label: 'Month',
          autocomplete: forms.preventAutocomplete,
          attributes: { maxlength: '2' }
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4',
          value: ownerDetails['dateOfBirth-year'],
          label: 'Year',
          autocomplete: forms.preventAutocomplete,
          attributes: { maxlength: '4' }
        }
      ]
    },
    postcode: {
      label: {
        text: 'Postcode'
      },
      id: 'postcode',
      name: 'postcode',
      classes: 'govuk-input--width-10',
      value: ownerDetails?.postcode,
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
      value: ownerDetails?.houseNumber,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '50' }
    },
    errors: []
  }

  errorPusherWithDate(errors, this.model)
}

module.exports = ViewModel
