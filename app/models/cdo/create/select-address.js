const { routes } = require('../../../constants/cdo/owner')

function ViewModel (details, addresses = [], error) {
  const items = addresses
    ? addresses.map((address, index) => ({
        text: `${address.addressLine1}, ${address.town}, ${address.postcode}`,
        value: index
      }))
    : []

  this.model = {
    backLink: details?.source === 'create' ? routes.postcodeLookupCreate.get : details?.backLink,
    changeAddressLink: details?.source === 'create'
      ? routes.address.get
      : `${routes.editAddress.get}/${details.personReference}/session${details.srcHashParam}`,
    changePostcodeLink: details?.source === 'create'
      ? `${routes.postcodeLookupCreate.get}`
      : `${details?.backLink}#postcode`,
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
