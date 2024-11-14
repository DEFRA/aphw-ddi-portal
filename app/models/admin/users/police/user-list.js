const { errorPusherDefault } = require('../../../../lib/error-helpers')
const { routes } = require('../../../../constants/admin')

/**
 * @typedef AddOrRemoveDetails
 * @property {string} [optionText]
 * @property {string} recordType
 * @property {string} recordTypeText
 */

/**
 * @param {{ users: UserAccount[], count: number }} details
 * @param {{ policeForce?: string; sort?: unknown }} options
 * @param [backNav]
 * @param [errors]
 * @constructor
 */
function ViewModel (details, options, backNav, errors) {
  const tableHeadings = [
    {
      label: 'Email address',
      // link: columnLink(sort, undefined),
      // ariaSort: getAriaSort(sort, undefined),
      name: 'emailAddress'
    },
    {
      label: 'Police force',
      // link: columnLink(sort, 'indexNumber'),
      // ariaSort: getAriaSort(sort, 'indexNumber'),
      name: 'policeForce'
    },
    {
      label: 'Index access',
      // link: columnLink(sort, 'dateOfBirth'),
      // ariaSort: getAriaSort(sort, 'dateOfBirth'),
      name: 'indexAccess'
    }
  ]

  this.model = {
    backLink: backNav?.backLink || routes.index.get,
    fieldset: {
      legend: {
        text: 'Police officers with access to the Index',
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l govuk-!-margin-bottom-5'
      },
      classes: 'govuk-!-margin-bottom-8'
    },
    tableHeadings,
    policeOfficers: details.users.map(user => ({
      email: user.username,
      policeForce: user.policeForce,
      indexAccess: user.accepted && user.activated ? 'Yes' : 'Invite sent'
    })),
    count: details.count,
    policeForce: options.policeForce,
    sort: {
      column: 'email',
      order: 'ASC',
      ...options.sort
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
