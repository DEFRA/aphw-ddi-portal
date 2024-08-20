const { errorPusherDefault } = require('../../../lib/error-helpers')
const { formatDogRadioAsHtml } = require('../../../lib/format-helpers')

function ViewModel (ownerDetails, dogResults, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    firstName: ownerDetails.firstName,
    lastName: ownerDetails.lastName,
    selectDogFieldset: {
      legend: {
        text: `Select the dog for ${ownerDetails.firstName} ${ownerDetails.lastName}`,
        classes: 'govuk-fieldset__legend--l govuk-!-margin-bottom-6',
        isPageHeading: true
      }
    },
    dogs: dogResults,
    dog: {
      id: 'dog',
      name: 'dog',
      items: dogResults.map((val, idx) => ({
        html: formatDogRadioAsHtml(val),
        value: `${idx}`
      })).concat([
        {
          divider: 'or'
        },
        {
          text: 'Add a new dog for this owner',
          value: -1
        }
      ])
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
