const { getOwnerDetails, getEnforcementDetails, setEnforcementDetails } = require('../session/cdo/owner')
const { lookupPoliceForceByPostcode } = require('../api/police-area')

const extractEmail = (contacts) => {
  if (!contacts || contacts.length === 0) {
    return ''
  }
  const email = contacts.filter(x => x.contact.contact_type.contact_type === 'Email').sort(propertyComparatorDesc('contact', 'id')).map(y => y.contact.contact)
  return email.length > 0 ? email[0] : null
}

const extractLatestPrimaryTelephoneNumber = (contacts) => {
  if (contacts && contacts.length > 0) {
    const primaryPhones = contacts.filter(x => x.contact.contact_type.contact_type === 'Phone').sort(propertyComparatorDesc('contact', 'id')).map(y => y.contact.contact)
    if (primaryPhones.length > 0) {
      return primaryPhones[0]
    }
  }
  return null
}

const extractLatestSecondaryTelephoneNumber = (contacts) => {
  if (contacts && contacts.length > 0) {
    const secondaryPhones = contacts.filter(x => x.contact.contact_type.contact_type === 'SecondaryPhone').sort(propertyComparatorDesc('contact', 'id')).map(y => y.contact.contact)
    if (secondaryPhones.length > 0) {
      return secondaryPhones[0]
    }
  }
  return null
}

const extractLatestAddress = (addresses) => {
  if (addresses == null || addresses.length === 0) {
    return {}
  }
  const latestAddress = addresses.sort(propertyComparatorDesc('address', 'id'))[0].address
  return {
    addressLine1: latestAddress.address_line_1,
    addressLine2: latestAddress.address_line_2,
    town: latestAddress.town,
    postcode: latestAddress.postcode,
    country: latestAddress.country?.country
  }
}

const formatAddressAsArray = address => {
  return [].concat(address.addressLine1, address.addressLine2, address.town, address.postcode).filter(el => el != null && el !== '')
}

const extractLatestInsurance = (insurances) => {
  if (insurances == null || insurances.length === 0) {
    return {}
  }
  return insurances.sort(propertyComparatorDesc('id'))[0]
}

const propertyComparatorDesc = (propertyName, childPropertyName) => {
  return function (a, b) {
    return childPropertyName ? b[propertyName][childPropertyName] - a[propertyName][childPropertyName] : b[propertyName] - a[propertyName]
  }
}

const deepClone = obj => {
  return JSON.parse(JSON.stringify(obj))
}

const cleanUserDisplayName = (displayName) => {
  if (displayName.includes(',')) {
    const [lastName, firstName] = displayName.split(',')

    return `${firstName.trim()} ${lastName.trim()}`
  }
  return displayName
}

const setPoliceForce = async (request, postcode = null) => {
  const ownerDetails = postcode ? { address: { postcode } } : getOwnerDetails(request)
  const enforcementDetails = getEnforcementDetails(request) || {}
  const policeForce = await lookupPoliceForceByPostcode(ownerDetails.address.postcode)

  if (policeForce) {
    enforcementDetails.policeForce = policeForce.id
    setEnforcementDetails(request, enforcementDetails)
  }
}

const dedupeAddresses = items => {
  const uniqueAddressTexts = new Set()
  const uniqueAddressObjects = []
  if (items) {
    items.forEach(addr => {
      if (!uniqueAddressTexts.has(addr.text)) {
        uniqueAddressTexts.add(addr.text)
        uniqueAddressObjects.push(addr)
      }
    })
  }
  return uniqueAddressObjects
}

module.exports = {
  extractEmail,
  extractLatestAddress,
  formatAddressAsArray,
  extractLatestInsurance,
  extractLatestPrimaryTelephoneNumber,
  extractLatestSecondaryTelephoneNumber,
  deepClone,
  cleanUserDisplayName,
  setPoliceForce,
  dedupeAddresses
}
