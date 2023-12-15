
const extractEmail = (contacts) => {
  if (!contacts || contacts.length === 0) {
    return ''
  }
  const email = contacts.filter(x => x.contact.contact_type_i === 2).sort(propertyComparatorDesc('contact', 'id')).map(y => y.contact.contact)
  return email.length > 0 ? email[0] : null
}

const extractTelephoneNumbers = (contacts) => {
  if (!contacts || contacts.length === 0) {
    return []
  }
  return contacts.filter(x => x.contact.contact_type_i === 1).sort(propertyComparatorAsc('contact', 'id')).map(y => y.contact.contact)
}

const extractLatestAddress = (addresses) => {
  if (addresses == null || addresses.length === 0) {
    return []
  }
  const latestAddress = addresses.sort(propertyComparatorDesc('address', 'id'))[0].address
  return [].concat(latestAddress.address_line_1, latestAddress.address_line_2, latestAddress.town, latestAddress.postcode).filter(el => el != null)
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

const propertyComparatorAsc = (propertyName, childPropertyName) => {
  return function (a, b) {
    return childPropertyName ? a[propertyName][childPropertyName] - b[propertyName][childPropertyName] : a[propertyName] - b[propertyName]
  }
}

module.exports = {
  extractEmail,
  extractLatestAddress,
  extractLatestInsurance,
  extractTelephoneNumbers
}
