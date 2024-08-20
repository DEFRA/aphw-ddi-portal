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
        text: `Select the address for ${ownerDetails.firstName} ${ownerDetails.lastName}`,
        classes: 'govuk-fieldset__legend--l govuk-!-margin-bottom-6',
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
          text: "The owner's address is not listed",
          value: -1,
          hint: {
            html: 'By not selecting a listed address,<br>you will create a new owner record'
          }
        }
      ])
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
