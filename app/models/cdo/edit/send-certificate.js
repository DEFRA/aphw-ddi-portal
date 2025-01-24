const { forms } = require('../../../constants/forms')
const { errorPusherDefault } = require('../../../lib/error-helpers')
const { extractEmail } = require('../../../lib/model-helpers')
const { sanitiseText } = require('../../../lib/sanitise')

function ViewModel (cdo, firstCertificate, payload, backNav, errors) {
  const email = sanitiseText(extractEmail(cdo.person.person_contacts))

  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber: cdo.dog.indexNumber,
    titleText: firstCertificate ? 'How do you want to send the certificate of exemption?' : 'How do you want to send the replacement certificate of exemption?',
    sendOption: {
      id: 'sendOption',
      name: 'sendOption',
      items: [
        {
          value: 'email',
          html: `Email it to: <p class="govuk-!-margin-top-1 govuk-!-margin-bottom-0">${email}</p>`
        },
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

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
