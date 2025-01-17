const { sanitiseText } = require('../../../../lib/sanitise')

/**
 * @param {CdoTaskListDto} data
 * @param backNav
 * @param errors
 * @constructor
 */
function ViewModel (data, backNav, errors) {
  const backLink = backNav.backLink === '/' ? `/cdo/manage/cdo/${data.indexNumber}` : backNav.backLink

  const address = [
    [data.cdoSummary.person.firstName, data.cdoSummary.person.lastName].join(' '),
    data.cdoSummary.person.addressLine1,
    data.cdoSummary.person.addressLine2,
    data.cdoSummary.person.town,
    data.cdoSummary.person.postcode
  ].filter(Boolean).join('<br>')

  const sanitisedEmail = sanitiseText(data.cdoSummary.person.email)

  let emailError = errors?.details?.reduce((errorText, errorDetail) => {
    if (errorDetail.path[0] === 'email' || errorDetail.context.path?.[0] === 'email') {
      return errorDetail.message
    }
    return errorText
  }, '') || ''

  const emailValue = data.payload?.email ?? ''

  if (emailError.length) {
    emailError = `      <span class="govuk-visually-hidden">Error:</span> ${emailError}`
    emailError = '    <p id="contact-by-email-error" class="govuk-error-message">' + emailError
    emailError += '    </p>'
  }

  const email = sanitisedEmail
    ? {
        html: `Email it to:<p class="govuk-!-margin-top-1 govuk-!-margin-bottom-0">${sanitisedEmail}</p>`,
        value: 'email'
      }
    : {
        text: 'Email',
        value: 'email',
        conditional: {
          type: 'email',
          html: `<div class="govuk-form-group${emailError.length ? ' govuk-form-group--error' : ''}">` +
        '    <label class="govuk-label" for="new-email">\n' +
        '      Email address' +
        '    </label>' +
              emailError +
        '    <div id="event-name-hint" class="govuk-hint">' +
        '      Enter the dog owner’s email address.' +
        '    </div>' +
        `    <input class="govuk-input govuk-!-width-two-thirds${emailError.length ? ' govuk-input--error' : ''}" name="email" type="email" value="${emailValue}">` +
        '    <input name="updateEmail" type="hidden" value="true">' +
        '  <div></div><div></div></div>'
        }
      }
  /**
   * @type {GovukRadios}
   */
  const contact = {
    name: 'contact',
    value: data.payload?.contact,
    items: [
      email,
      {
        html: `Post it to:<p class="govuk-!-margin-top-1 govuk-!-margin-bottom-0">${address}</p>`,
        value: 'post'
      }
    ]
  }

  this.model = {
    backLink,
    continueLink: backLink + '?action=continue',
    srcHashParam: backNav.srcHashParam,
    indexNumber: data.indexNumber,
    person: data.cdoSummary.person,
    taskName: data.taskName,
    disabled: data.task.completed,
    taskDone: {
      id: 'taskDone',
      name: 'taskDone',
      items: [
        {
          value: 'Y',
          text: 'I have sent the application pack',
          checked: data.task.completed,
          disabled: data.task.completed
        }
      ]
    },
    contact,
    errors: []
  }

  if (errors) {
    for (const error of errors.details) {
      const name = error.path[0] ?? error.context.path[0]
      let prop = this.model[name]

      if (name === 'email') {
        const item = this.model.contact.items[0]
        prop = item.conditional
      }
      if (prop) {
        prop.errorMessage = { text: error.message }
        this.model.errors.push({ text: error.message, href: `#${name}` })
      }
    }
  }
}

module.exports = ViewModel
