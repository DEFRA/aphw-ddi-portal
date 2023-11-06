const { routes } = require('../../../constants/owner')

function ViewModel (value, error) {
  this.model = {
    formAction: routes.postcode.get,
    backLink: routes.name.get,
    postcode: {
      label: {
        text: 'Postcode'
      },
      id: 'postcode',
      name: 'postcode',
      classes: 'govuk-input--width-10',
      value,
      autocomplete: 'postcode'
    }
  }

  if (error) {
    this.model.postcode.errorMessage = {
      text: 'Enter your postcode.'
    }
  }
}

module.exports = ViewModel
