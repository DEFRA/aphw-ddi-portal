const { errorPusherDefault, defaultPropCreator } = require('../../../../lib/error-helpers')
const { conditionalEmailRadio } = require('../../../builders/email-conditional')

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

  const email = conditionalEmailRadio(data.cdoSummary.person.email, data.payload?.email, { emailText: 'Email it to', noEmailText: 'Email' }, errors)

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

  const pushEmailError = (name, model) => {
    if (name === 'email') {
      const item = model.contact.items[0]
      return item.conditional
    }
    return defaultPropCreator(name, model)
  }

  errorPusherDefault(errors, this.model, pushEmailError)
}

module.exports = ViewModel
