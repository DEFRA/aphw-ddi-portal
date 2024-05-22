const { errorPusherDefault } = require('../../../lib/error-helpers')

/**
 * @typedef ConfirmDetailsDogAndOwner
 * @property {string} pk
 * @property {string} ownerPk
 * @property {string} firstName
 * @property {string} lastName

 * @property {string} [backLink]
 * @property {string} [confirmHint]
 */
/**
 * @param {ConfirmDetailsDogAndOwner} details
 * @param [backNav]
 * @param [errors]
 * @constructor
 */
function ViewModel (details, backNav, errors) {
  this.model = {
    backLink: details.backLink ?? backNav?.backLink,
    confirmOwner: {
      fieldset: {
        legend: {
          text: `Delete the owner record for ${details.firstName} ${details.lastName}?`,
          classes: 'govuk-fieldset__legend--m'
        }
      },
      id: 'confirmOwner',
      name: 'confirmOwner',
      classes: 'govuk-!-font-size-16',
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
    confirmHint: details.confirmHint,
    ownerRecordName: `${details.firstName} ${details.lastName}`,
    pk: details.pk,
    ownerPk: details.ownerPk,
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
