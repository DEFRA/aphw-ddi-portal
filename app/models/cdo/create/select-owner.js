const { routes } = require('../../../constants/cdo/owner')
const { formatAddress, formatAddressSingleLine } = require('../../../lib/format-helpers')
const { errorPusherDefault } = require('../../../lib/error-helpers')

function ViewModel (ownerDetails, ownerResults, errors) {
  this.model = {
    backLink: routes.ownerDetails.get,
    firstName: ownerDetails.firstName,
    lastName: ownerDetails.lastName,
    selectAddressFieldset: {
      legend: {
        text: 'Select the address',
        classes: 'govuk-fieldset__legend--m',
        isPageHeading: true
      }
    },
    owners: ownerResults.map(x => ({
      ...x,
      address: formatAddress(x.address, { hideCountry: true })
    })),
    changeAddressLink: routes.address.get,
    address: {
      id: 'address',
      name: 'address',
      items: ownerResults.map((type, idx) => ({
        text: formatAddressSingleLine(type.address),
        value: `${idx}`
      })).concat([
        {
          divider: 'or'
        },
        {
          text: 'Create a new record',
          value: -1
        }
      ])
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
