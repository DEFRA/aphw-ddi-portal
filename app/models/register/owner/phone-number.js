const { routes } = require('../../../constants/owner')

function ViewModel (phoneNumber, error) {
  this.model = {
    formAction: routes.phoneNumber.get,
    backLink: routes.dateOfBirth.get,
    phoneNumber: {
      label: {
        text: 'What is the owner\'s telephone number?',
        classes: 'govuk-label--l',
        isPageHeading: true
      },
      id: 'phoneNumber',
      name: 'phoneNumber',
      type: 'tel',
      autocomplete: 'tel',
      classes: 'govuk-input--width-20',
      value: phoneNumber
    }
  }

  if (error) {
    this.model.phoneNumber.errorMessage = {
      text: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192'
    }
  }
}

module.exports = ViewModel
