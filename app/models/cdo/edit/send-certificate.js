const { forms } = require('../../../constants/forms')
const { errorPusherDefault } = require('../../../lib/error-helpers')
const { extractEmail } = require('../../../lib/model-helpers')
const { conditionalEmailRadio } = require('../../builders/email-conditional')

function ViewModel (cdo, firstCertificate, payload, backNav, errors) {
  const email = conditionalEmailRadio(extractEmail(cdo.person.person_contacts), payload?.email, { emailText: 'Email it to', noEmailText: 'Email' }, errors)

  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber: cdo.dog.indexNumber,
    titleText: firstCertificate ? 'How do you want to send the certificate of exemption?' : 'How do you want to send the replacement certificate of exemption?',
    sendOption: {
      id: 'sendOption',
      name: 'sendOption',
      items: [
        email,
        {
          value: 'post',
          text: 'Post it'
        }
      ],
      autocomplete: forms.preventAutocomplete,
      classes: 'defra-responsive-!-font-size-16',
      value: payload.sendOption ?? 'email'
    },
    errors: []
  }

  // Force any back-end errors to appear against the only field of the page
  if (errors) {
    for (const error of errors.details) {
      error.path = ['sendOption']
    }
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
