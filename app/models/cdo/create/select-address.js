const { routes } = require('../../../constants/owner')

function ViewModel (postcode, addresses = [], error) {
  const items = addresses.map((address, index) => ({
    text: `${address.addressLine1}, ${address.addressTown}, ${address.addressPostcode}`,
    value: index
  }))

  this.model = {
    formAction: routes.address.get,
    backLink: routes.ownerDetails.get,
    changePostcodeLink: `${routes.ownerDetails.get}#postcode`,
    addressRoute: routes.address.get,
    postcode,
    results: {
      id: 'addresses',
      name: 'address',
      items,
      classes: 'govuk-radios--small'
    }
  }

  if (error) {
    this.model.results.errorMessage = {
      text: 'Select an address.'
    }
  }
}

module.exports = ViewModel
