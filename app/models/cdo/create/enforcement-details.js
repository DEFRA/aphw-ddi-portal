const { routes } = require('../../../constants/cdo/owner')
const { forms } = require('../../../constants/forms')
const { errorPusherDefault } = require('../../../lib/error-helpers')

function ViewModel (enforcementDetails, courts, courtIsMandatory, policeForces, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    addressRoute: routes.address.get,
    court: {
      label: {
        text: courtIsMandatory ? 'Court' : 'Court (optional)'
      },
      hint: {
        text: 'Only required for new CDOs'
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
      classes: 'govuk-!-width-two-thirds',
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
      classes: 'govuk-!-width-two-thirds',
      value: enforcementDetails?.legislationOfficer,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '64' }
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
