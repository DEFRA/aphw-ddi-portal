const { routes } = require('../../../constants/cdo/owner')
const { formatAddress, formatAddressSingleLine } = require('../../../lib/format-helpers')
const { errorPusherDefault } = require('../../../lib/error-helpers')

function ViewModel (ownerDetails, ownerResults, errors) {
  this.model = {
    backLink: routes.ownerDetails.get,
    firstName: ownerDetails.firstName,
    lastName: ownerDetails.lastName,
    owners: ownerResults.map(x => ({
      ...x,
      address: formatAddress(x.address, true)
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
          text: "The owner's address is not listed",
          value: -1
        }
      ])
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
