const { forms } = require('../../../constants/forms')
const { errorPusherDefault } = require('../../../lib/error-helpers')
const { extractEmail } = require('../../../lib/model-helpers')
const { sanitiseText } = require('../../../lib/sanitise')

function ViewModel (cdo, payload, backNav, errors) {
  const email = sanitiseText(extractEmail(cdo.person.person_contacts))

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
        {
          value: 'email',
          html: `Email confirmation to: <p class="govuk-!-margin-top-1 govuk-!-margin-bottom-0">${email}</p>`
        },
        {
          value: 'post',
          text: 'Postal confirmation'
        }
      ],
      autocomplete: forms.preventAutocomplete,
      classes: 'defra-responsive-!-font-size-16',
      value: payload.withdrawOption ?? 'email'
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
