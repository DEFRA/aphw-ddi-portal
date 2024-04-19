const { routes: ownerRoutes } = require('../../../constants/cdo/owner')
const { errorPusherDefault } = require('../../../lib/error-helpers')
const { formatDogRadioAsHtml } = require('../../../lib/format-helpers')

function ViewModel (ownerDetails, dogResults, errors) {
  this.model = {
    backLink: ownerRoutes.selectOwner.get,
    firstName: ownerDetails.firstName,
    lastName: ownerDetails.lastName,
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
