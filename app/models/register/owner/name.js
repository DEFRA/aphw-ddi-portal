const { routes } = require('../../../constants/owner')

function ViewModel (name, errors) {
  this.model = {
    formAction: routes.name.get,
    backLink: '/',
    title: {
      label: {
        text: 'Title'
      },
      id: 'title',
      name: 'title',
      classes: 'govuk-input--width-5',
      value: name.title
    },
    firstName: {
      label: {
        text: 'First name'
      },
      id: 'firstName',
      name: 'firstName',
      classes: 'govuk-input--width-20',
      value: name.firstName
    },
    lastName: {
      label: {
        text: 'Last name'
      },
      id: 'lastName',
      name: 'lastName',
      classes: 'govuk-input--width-20',
      value: name.lastName
    },
    errors: []
  }

  if (errors) {
    for (const error of errors.details) {
      const name = error.path[0]

      const prop = this.model[name]

      if (prop !== undefined) {
        prop.errorMessage = {
          text: error.message
        }

        this.model.errors.push({
          text: error.message,
          href: `#${name}`
        })
      }
    }
  }
}

module.exports = ViewModel
