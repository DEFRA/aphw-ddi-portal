const { routes } = require('../../../constants/cdo/owner')

function ViewModel (details, addresses = [], error) {
  const items = addresses.map((address, index) => ({
    text: `${address.addressLine1}, ${address.addressTown}, ${address.addressPostcode}`,
    value: index
  }))

  this.model = {
    formAction: routes.address.get,
    backLink: details?.source === 'create' ? routes.ownerDetails.get : details.backLink,
    changePostcodeLink: details?.source === 'create' ? `${routes.ownerDetails.get}#postcode` : details.backLink,
    addressRoute: routes.address.get,
    buttonText: details?.source === 'create' ? 'Select address' : 'Save address',
    source: details?.source,
    postcode: details?.postcode,
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
