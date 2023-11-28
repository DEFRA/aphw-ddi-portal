const { routes } = require('../../../constants/owner')

function ViewModel (postcode, addresses = [], error) {
  const defaultOption = {
    text: `${addresses.length} addresses found`,
    value: -1
  }

  const items = [defaultOption].concat(addresses.map((address, index) => ({
    text: `${address.addressLine1}, ${address.addressTown}, ${address.addressPostcode}`,
    value: index
  })))

  this.model = {
    formAction: routes.address.get,
    backLink: routes.postcode.get,
    postcode,
    results: {
      label: {
        text: 'Select an address'
      },
      id: 'addresses',
      name: 'address',
      items
    }
  }

  if (error) {
    this.model.results.errorMessage = {
      text: 'Select an address.'
    }
  }
}

module.exports = ViewModel
