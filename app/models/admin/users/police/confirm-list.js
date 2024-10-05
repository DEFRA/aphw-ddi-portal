const { errorPusherDefault } = require('../../../../lib/error-helpers')
const { forms } = require('../../../../constants/forms')

/**
 * @typedef AddListInputModel
 * @property {string[]} usersList
 * @property {string} backLink
 * @property {import('../../../builders/components').Fieldset} fieldset
 * @property {import('../../../builders/components').GoukSummaryList} summaryList
 * @property {import('../../../builders/components').GovukButton} continue
 * @property {*} autocomplete
 * @property {*[]} errors
 */

/**
 * @param {{ users: string[]; backlink?: string }} details
 * @param [backNav]
 * @param [errors]
 * @return {*}
 * @constructor
 */
function ViewModel (details, backNav, errors) {
  /**
   * @type {AddListInputModel}
   */
  const inputModel = {
    usersList: details.users,
    backLink: details.backlink,
    fieldset: {
      legend: {
        text: 'Check your answers before giving the police officers access',
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
              }
            ]
          }
        }
      })
    },
    continue: {
      preventDoubleClick: true,
      text: 'Give access',
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
