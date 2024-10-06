const { errorPusherDefault } = require('../../../../lib/error-helpers')
const { summaryList, policeListDefaults } = require('./common')

/**
 * @typedef AddListInputModel
 * @property {string[]} users
 * @property {string} backLink
 * @property {import('../../../builders/components').Fieldset} fieldset
 * @property {import('../../../builders/components').GoukSummaryList} summaryList
 * @property {import('../../../builders/components').Fieldset} label
 * @property {import('../../../builders/components').GovukRadios} radios
 * @property {import('../../../builders/components').GovukButton} button
 * @property {*} autocompete
 * @property {*[]} errors
 */

const getPoliceOfficerText = (count) => {
  if (count === 1) {
    return 'police officer'
  }
  return 'police officers'
}

/**
 * @param {{ users: string[]; backlink?: string }} details
 * @param [backNav]
 * @param [errors]
 * @return {*}
 * @constructor
 */
function ViewModel (details, backNav, errors) {
  const count = details.users.length
  /**
   * @type {AddListInputModel}
   */
  const inputModel = {
    usersList: details.users,
    backLink: details.backlink,
    fieldset: {
      legend: {
        text: `You have added ${count} ${getPoliceOfficerText(count)}`,
        classes: 'govuk-fieldset__legend--l',
        isPageHeading: true
      }
    },
    summaryList: summaryList(details.users),
    radios: {
      fieldset: {
        legend: {
          text: 'Do you need to add another police offers?',
          classes: 'govuk-fieldset__legend--m'
        },
        classes: 'govuk-!-margin-top-5 govuk-visually-hidden'
      },
      classes: 'govuk-radios--inline',
      items: [
        {
          text: 'Yes',
          value: 'Y',
          name: 'add-officer',
          disabled: true
        },
        {
          text: 'No',
          value: 'N',
          name: 'add-officer',
          checked: true
        }
      ]
    },
    continue: {
      preventDoubleClick: true,
      text: 'Continue',
      type: 'submit',
      name: 'continue'
    },
    ...policeListDefaults
  }

  this.model = inputModel

  errorPusherDefault(errors, this.model)

  if (!this.model.errors.length && errors?.details.length) {
    errors.details.forEach(error => {
      this.model.errors.push({ text: error.message, href: '#' })
    })
  }
}

module.exports = ViewModel
