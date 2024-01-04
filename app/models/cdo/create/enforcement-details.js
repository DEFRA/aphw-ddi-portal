const { routes } = require('../../../constants/owner')
const { forms } = require('../../../constants/forms')

function ViewModel (enforcementDetails, courts, policeForces, errors) {
  this.model = {
    formAction: routes.enforcementDetails.get,
    backLink: routes.selectAddress.get,
    addressRoute: routes.address.get,
    court: {
      label: {
        text: 'Court'
      },
      id: 'court',
      name: 'court',
      value: enforcementDetails?.court,
      placeholder: 'Start typing to choose court',
      items: [{ text: '', value: null }].concat(courts.map(court => ({
        value: court.id,
        text: court.name
      }))),
      autocomplete: forms.preventAutocomplete
    },
    policeForce: {
      label: {
        text: 'Police force'
      },
      hint: {
        text: 'Chosen using dog owner\'s postcode'
      },
      id: 'policeForce',
      name: 'policeForce',
      value: enforcementDetails?.policeForce,
      items: [{ text: 'Select a police force', value: null }].concat(policeForces.map(force => ({
        value: force.id,
        text: force.name
      }))),
      autocomplete: forms.preventAutocomplete
    },
    legislationOfficer: {
      label: {
        text: 'Dog legislation officer (optional)'
      },
      id: 'legislationOfficer',
      name: 'legislationOfficer',
      classes: 'govuk-input--width-20',
      value: enforcementDetails?.legislationOfficer,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '64' }
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
