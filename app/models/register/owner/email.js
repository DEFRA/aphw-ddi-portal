const { routes } = require('../../../constants/owner')

function ViewModel (email, error) {
  this.model = {
    formAction: routes.email.get,
    backLink: routes.phoneNumber.get,
    email: {
      label: {
        text: 'What is the owner\'s email address?',
        classes: 'govuk-label--l',
        isPageHeading: true
      },
      id: 'email',
      name: 'email',
      value: email
    }
  }

  if (error) {
    this.model.email.errorMessage = {
      text: 'Enter a email address in the correct format.'
    }
  }
}

module.exports = ViewModel
