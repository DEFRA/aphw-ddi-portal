const { routes } = require('../../../constants/owner')

function ViewModel (ownerDetails, errors) {
  this.model = {
    formAction: routes.ownerDetails.get,
    backLink: routes.address.get,
    addressRoute: routes.address.get,
    firstName: {
      label: {
        text: 'First name'
      },
      id: 'firstName',
      name: 'firstName',
      classes: 'govuk-input--width-20',
      value: ownerDetails?.firstName
    },
    lastName: {
      label: {
        text: 'Last name'
      },
      id: 'lastName',
      name: 'lastName',
      classes: 'govuk-input--width-20',
      value: ownerDetails?.lastName
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
          name: 'day',
          classes: 'govuk-input--width-2',
          value: ownerDetails?.day
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2',
          value: ownerDetails?.month
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4',
          value: ownerDetails?.year
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
      autocomplete: 'postcode',
      value: ownerDetails?.postcode
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
      classes: 'govuk-input--width-10',
      autocomplete: 'houseNumber',
      value: ownerDetails?.houseNumber
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
          href: `#${name || 'day'}`
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
