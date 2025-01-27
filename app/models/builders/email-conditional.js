const { sanitiseText } = require('../../lib/sanitise')

/**
 * @param {string} email
 * @param {string} payloadEmail
 * @param emailText
 * @param noEmailText
 * @param errors
 * @return {{conditional: {html: string, type: string}, text: string, value: string}|{html: string, value: string}}
 */
const conditionalEmailRadio = (email, payloadEmail, { emailText, noEmailText }, errors) => {
  const sanitisedEmail = sanitiseText(email)
  const emailValue = payloadEmail ?? ''
  let emailError = errors?.details?.reduce((errorText, errorDetail) => {
    if (errorDetail.path[0] === 'email' || errorDetail.context.path?.[0] === 'email') {
      return errorDetail.message
    }
    return errorText
  }, '') || ''

  if (emailError.length) {
    emailError = `      <span class="govuk-visually-hidden">Error:</span> ${emailError}`
    emailError = '    <p id="contact-by-email-error" class="govuk-error-message">' + emailError
    emailError += '    </p>'
  }

  if (sanitisedEmail) {
    return {
      html: `${emailText}:<p class="govuk-!-margin-top-1 govuk-!-margin-bottom-0">${sanitisedEmail}</p>`,
      value: 'email'
    }
  }

  return {
    text: noEmailText,
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
}

module.exports = {
  conditionalEmailRadio
}
