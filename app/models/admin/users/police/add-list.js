const { errorPusherDefault } = require('../../../../lib/error-helpers')
const { forms } = require('../../../../constants/forms')
const { ValidationError } = require('joi')

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
    summaryList: {
      rows: details.users.map((user, idx) => {
        return {
          key: {
            text: user,
            classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular'
          },
          value: '',
          actions: {
            classes: 'govuk-!-width-one-third govuk-visually-hidden',
            items: [
              {
                text: 'Change',
                visuallyHiddenText: `Change ${user}`,
                classes: 'govuk-!-hidden'
              },
              {
                text: 'Remove',
                visuallyHiddenText: `remove ${user}`
              }
            ]
          }
        }
      })
    },
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
    autocomplete: forms.preventAutocomplete,
    errors: []
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
