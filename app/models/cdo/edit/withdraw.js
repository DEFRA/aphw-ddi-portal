const { forms } = require('../../../constants/forms')
const { errorPusherDefault, defaultPropCreator } = require('../../../lib/error-helpers')
const { extractEmail } = require('../../../lib/model-helpers')
const { conditionalEmailRadio } = require('../../builders/email-conditional')

function ViewModel (cdo, payload, backNav, errors) {
  const email = conditionalEmailRadio(
    extractEmail(cdo.person.person_contacts),
    payload?.email,
    { emailText: 'Email confirmation to', noEmailText: 'Email confirmation' },
    errors
  )

  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber: cdo.dog.indexNumber,
    withdrawOption: {
      label: {
        text: 'Withdraw the dog and send the owner confirmation',
        classes: 'govuk-!-font-weight-bold defra-responsive-!-font-size-16'
      },
      id: 'withdrawOption',
      name: 'withdrawOption',
      items: [
        email,
        {
          value: 'post',
          text: 'Post confirmation'
        }
      ],
      autocomplete: forms.preventAutocomplete,
      classes: 'defra-responsive-!-font-size-16',
      value: payload.withdrawOption ?? 'email'
    },
    errors: []
  }

  const pushEmailError = (name, model) => {
    if (name === 'email') {
      const item = model.withdrawOption.items[0]
      return item.conditional
    }
    return defaultPropCreator(name, model)
  }

  errorPusherDefault(errors, this.model, pushEmailError)
}

module.exports = ViewModel
