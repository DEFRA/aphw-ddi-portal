const { routes } = require('../../../constants/cdo/owner')
const { forms } = require('../../../constants/forms')

function ViewModel (ownerDetails, errors) {
  this.model = {
    formAction: routes.ownerDetails.get,
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
      id: 'owner-date-of-birth',
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
          name: 'dobDay',
          classes: 'govuk-input--width-2',
          value: ownerDetails?.dobDay,
          label: 'Day',
          autocomplete: forms.preventAutocomplete,
          attributes: { maxlength: '2' }
        },
        {
          name: 'dobMonth',
          classes: 'govuk-input--width-2',
          value: ownerDetails?.dobMonth,
          label: 'Month',
          autocomplete: forms.preventAutocomplete,
          attributes: { maxlength: '2' }
        },
        {
          name: 'dobYear',
          classes: 'govuk-input--width-4',
          value: ownerDetails?.dobYear,
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

  if (errors) {
    for (const error of errors.details) {
      const name = error.path[0]
      const prop = this.model[name] || this.model.dateOfBirth.items.find(item => item.name === name) || this.model.dateOfBirth

      if (prop !== undefined) {
        prop.errorMessage = {
          text: error.message
        }

        this.model.errors.push({
          text: error.message,
          href: `#${name || this.model.dateOfBirth.id}`
        })
      }

      const propDOB = this.model.dateOfBirth.items.find(item => item.name === name)

      if (propDOB !== undefined) {
        propDOB.classes += ' govuk-input--error'
        this.model.dateOfBirth.errorMessage = {
          text: propDOB.errorMessage.text
        }
      }

      if (name === undefined) {
        this.model.dateOfBirth.items.forEach(x => { x.classes += ' govuk-input--error' })
      }
    }
  }
}

module.exports = ViewModel
