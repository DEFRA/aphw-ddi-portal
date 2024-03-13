const { routes } = require('../../../constants/cdo/owner')
const { formatAddress, formatAddressSingleLine } = require('../../../lib/format-helpers')

function ViewModel (ownerDetails, ownerResults, errors) {
  this.model = {
    backLink: routes.ownerDetails.get,
    firstName: ownerDetails.firstName,
    lastName: ownerDetails.lastName,
    addresses: ownerResults.map(x => formatAddress(x.address, true)),
    changeAddressLink: routes.address.get,
    addressRadios: {
      id: 'selectedAddress',
      name: 'selectedAddress',
      items: ownerResults.map(type => ({
        name: 'personReference',
        text: formatAddressSingleLine(type.address),
        value: type.personReference
      })).concat([
        {
          divider: 'or'
        },
        {
          name: 'personReference',
          text: "The owner's address is not listed",
          value: -1
        }
      ])
    },
    errors: []
  }

  if (errors) {
    for (const error of errors.details) {
      const name = error.path[0]
      const prop = this.model[name]

      if (prop !== undefined) {
        prop.errorMessage = {
          text: error.message
        }

        this.model.errors.push({
          text: error.message,
          href: `#${name}`
        })
      }
    }
  }
}

module.exports = ViewModel
