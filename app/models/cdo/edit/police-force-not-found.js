const { formatAddress } = require('../../../lib/format-helpers')

function ViewModel (person, cdo, breadcrumbLink) {
  this.model = {
    breadcrumbLink,
    policeForceName: cdo?.exemption?.policeForce,
    address: formatAddress(person?.address)
  }
}

module.exports = ViewModel
