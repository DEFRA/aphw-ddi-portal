const { routes } = require('../../../constants/cdo/owner')
const { UTCDate } = require('@date-fns/utc')
const { format } = require('date-fns')
const { keys } = require('../../../constants/cdo/dog')
const { formatToGds } = require('../../../lib/date-helpers')

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

const getCountry = address => address?.country || ''

function ViewModel (owner, address, enforcement, courts, policeForces, dogs, error) {
  this.model = {
    backLink: routes.enforcementDetails.get,
    summary: {
      owner: {
        name: formatName(owner),
        dateOfBirth: formatDate(owner?.dateOfBirth),
        address: formatAddress(address),
        country: getCountry(address)
      },
      court: (courts.find(x => x.id === parseInt(enforcement?.court)) || { name: '' }).name,
      policeForce: (policeForces.find(x => x.id === parseInt(enforcement?.policeForce)) || { name: '' }).name,
      dogLegislationOfficer: enforcement?.legislationOfficer,
      dogs: dogs.map((dog, index) => ({
        id: index + 1,
        name: dog[keys.name],
        microchipNumber: dog[keys.microchipNumber],
        breed: dog[keys.breed],
        cdoIssued: formatToGds(dog[keys.cdoIssued]),
        cdoExpiry: formatToGds(dog[keys.cdoExpiry]),
        interimExemption: formatToGds(dog[keys.interimExemption])
      })),
      error
    }
  }
}

module.exports = ViewModel
