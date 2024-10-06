const { errorPusherDefault } = require('../../../../lib/error-helpers')
const { policeListDefaults, summaryList } = require('./common')

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
    continue: {
      preventDoubleClick: true,
      text: 'Give access',
      type: 'submit',
      name: 'continue'
    },
    summaryList: summaryList(details.users),
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
