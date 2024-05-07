const { errorPusherDefault } = require('../../lib/error-helpers')
const { routes, breadcrumbs } = require('../../constants/admin')

/**
 * @typedef AddOrRemoveDetails
 * @property {string} [optionText]
 * @property {string} recordType
 * @property {Link[]} breadcrumbs
 * @property {string} recordTypeText
 */

/**
 * @param {AddOrRemoveDetails} details
 * @param [backNav]
 * @param [errors]
 * @constructor
 */
function ViewModel (details, backNav, errors) {
  this.model = {
    backLink: backNav?.backLink || routes.index.get,
    breadcrumbs: details.breadcrumbs ?? breadcrumbs,
    addOrRemove: {
      id: 'addOrRemove',
      name: 'addOrRemove',
      classes: 'govuk-!-font-size-16',
      items: [
        {
          text: 'Add',
          value: 'add'
        },
        {
          text: 'Remove',
          value: 'remove'
        }
      ]
    },
    optionText: details.optionText ? details.optionText : `Do you want to add or remove a ${details.recordTypeText}?`,
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
