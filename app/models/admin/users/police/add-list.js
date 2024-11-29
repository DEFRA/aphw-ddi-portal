const { errorPusherDefault } = require('../../../../lib/error-helpers')
const { summaryList, policeListDefaults } = require('./common')

/**
 * @typedef AddListInputModel
 * @property {string[]} users
 * @property {string} backLink
 * @property {import('../../../builders/components').GovukFieldset} fieldset
 * @property {import('../../../builders/components').GoukSummaryList} summaryList
 * @property {import('../../../builders/components').GovukFieldset} label
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
    users: details.users,
    usersList: details.users,
    backLink: details.backlink,
    fieldset: {
      legend: {
        text: `You have added ${count} ${getPoliceOfficerText(count)}`,
        classes: 'govuk-fieldset__legend--l',
        isPageHeading: true
      }
    },
    summaryList: summaryList(details.users, true),
    addAnother: {
      name: 'addAnother',
      fieldset: {
        legend: {
          text: 'Do you need to add another police officer?',
          classes: 'govuk-fieldset__legend--m'
        },
        classes: 'govuk-!-margin-top-5'
      },
      classes: 'govuk-radios--inline',
      items: [
        {
          text: 'Yes',
          value: 'Y'
        },
        {
          text: 'No',
          value: 'N'
        }
      ]
    },
    continue: {
      preventDoubleClick: true,
      text: 'Continue',
      type: 'submit',
      name: 'continue'
    },
    errors: [],
    ...policeListDefaults()
  }

  this.model = inputModel

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
