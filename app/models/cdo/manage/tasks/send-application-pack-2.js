const { errorPusherDefault } = require('../../../../lib/error-helpers')
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

  const email = sanitisedEmail
    ? {
        html: `Email it to:<p class="govuk-!-margin-top-1 govuk-!-margin-bottom-0">${sanitisedEmail}</p>`,
        value: 'email'
      }
    : {
        text: 'Email',
        value: 'email',
        conditional: {
          html: '<div class="govuk-form-group">' +
        '    <label class="govuk-label" for="new-email">\n' +
        '      Email address' +
        '    </label>' +
        '    <div id="event-name-hint" class="govuk-hint">' +
        '      Enter the dog owner’s email address.' +
        '    </div>' +
        '    <input class="govuk-input govuk-!-width-two-thirds" name="email" type="email">' +
        '    <input name="updateEmail" type="hidden" value="true">' +
        '  <div></div><div></div></div>'
        }
      }
  /**
   * @type {GovukRadios}
   */
  const contact = {
    name: 'contact',
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

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
