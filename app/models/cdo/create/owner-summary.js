const { routes } = require('../../../constants/owner')
const { UTCDate } = require('@date-fns/utc')
const { format } = require('date-fns')

const formatDate = (dob) => {
  if (dob == null || dob === '') {
    return ''
  }

  const parsedDate = new UTCDate(dob)

  return format(parsedDate, 'dd MMMM yyyy')
}

const formatName = owner => {
  if (owner == null) {
    return ''
  }

  const firstName = owner?.firstName
  const lastName = owner?.lastName

  return `${firstName} ${lastName}`
}

const formatAddress = addr => {
  if (addr == null) {
    return []
  }

  const addrParts = []
  if (addr.addressLine1) {
    addrParts.push(addr.addressLine1)
  }
  if (addr.addressLine2) {
    addrParts.push(addr.addressLine2)
  }
  if (addr.town) {
    addrParts.push(addr.town)
  }
  if (addr.postcode) {
    addrParts.push(addr.postcode)
  }

  return addrParts
}

function ViewModel (owner, address, enforcement, courts, policeForces, error) {
  this.model = {
    formAction: routes.ownerSummary.post,
    summary: {
      owner: {
        name: formatName(owner),
        dateOfBirth: formatDate(owner?.dateOfBirth),
        address: formatAddress(address)
      },
      court: (courts.find(x => x.id === parseInt(enforcement?.court)) || { name: '' }).name,
      policeForce: (policeForces.find(x => x.id === parseInt(enforcement?.policeForce)) || { name: '' }).name,
      dogLegislationOfficer: enforcement?.legislationOfficer,
      error
    }
  }
}

module.exports = ViewModel
