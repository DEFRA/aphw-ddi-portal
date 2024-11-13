const { errorPusherDefault } = require('../../../../lib/error-helpers')
const { routes } = require('../../../../constants/admin')
const { forms } = require('../../../../constants/forms')

/**
 * @typedef AddOrRemoveDetails
 * @property {string} [optionText]
 * @property {string} recordType
 * @property {string} recordTypeText
 */

/**
 * @param {{ users: UserAccount[], count: number, policeForce?: string; policeForces: PoliceForceDto[]  }} details
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

  /**
   *
   * @type {GovukButton}
   */
  const submit = {
    preventDoubleClick: true,
    text: 'Select police force',
    classes: 'govuk-!-margin-bottom-8'
  }

  /**
   * @type {AccessibleAutocompleteItem[]}
   */
  const items = details.policeForces.map(item => {
    return {
      text: item.name,
      value: item.id
    }
  })

  /**
   * @type {AccessibleAutocomplete}
   */
  const policeForce = {
    formGroup: {
      classes: 'govuk-!-width-one-third'
    },
    label: {
      text: 'Officers by police force',
      classes: 'govuk-label govuk-body'
    },
    id: 'policeForce',
    name: 'policeForce',
    value: details.policeForce ?? '',
    placeholder: 'Start typing to select a police force',
    items: [{ text: '', value: null }, ...items],
    autocomplete: forms.preventAutocomplete
  }

  this.model = {
    backLink: backNav?.backLink || routes.index.get,
    fieldset: {
      legend: {
        text: 'Police officers with access to the Index',
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l govuk-!-margin-bottom-5'
      }
    },
    tableHeadings,
    policeOfficers: details.users.map(user => ({
      email: user.username,
      policeForce: user.policeForce,
      indexAccess: user.accepted && user.activated ? 'Yes' : 'Invite sent'
    })),
    count: details.count,
    policeForce,
    submit,
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
