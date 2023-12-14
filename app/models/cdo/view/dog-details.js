const { routes: ownerRoutes } = require('../../../constants/owner')
const { formatToGds } = require('../../../lib/date-helpers')

function ViewModel (cdo) {
  const person = cdo.registered_person[0].person
  const address = person.addresses[0].address
  const contacts = person.person_contacts
  const insurance = extractLatestInsurance(cdo.insurance)

  this.model = {
    backLink: ownerRoutes.home.get,
    dog: {
      id: cdo.id,
      indexNumber: cdo.index_number,
      status: cdo.status.status,
      name: cdo.name,
      breed: cdo.dog_breed.breed,
      colour: cdo.colour,
      sex: cdo.sex,
      dateOfBirth: formatToGds(cdo.birth_date),
      dateOfDeath: formatToGds(cdo.dateOfDeath),
      tattoo: cdo.tattoo,
      microchipNumbers: [cdo.microchip_number],
      dateExported: formatToGds(cdo.dateExported),
      dateStolen: formatToGds(cdo.dateStolen)
    },
    person: {
      id: person.id,
      firstName: person.first_name,
      lastName: person.last_name,
      dateOfBirth: formatToGds(person.birth_date),
      addressLines: extractLatestAddress(person.addresses),
      country: address.country.country,
      email: extractEmail(contacts),
      telephoneNumbers: extractTelephoneNumbers(contacts)
    },
    exemption: {
      certificateIssued: formatToGds(cdo.registration.certificate_issued),
      cdoIssued: formatToGds(cdo.registration.cdo_issued),
      cdoExpiry: formatToGds(cdo.registration.cdoExpiry),
      court: cdo.registration.court.name,
      policeForce: cdo.registration.police_force.name,
      dogLegislationOfficer: cdo.registration.legislation_officer,
      applicationFeePaid: formatToGds(cdo.registration.application_fee_paid),
      insuranceCompany: insurance.company.company_name,
      policyNumber: insurance.policy_number,
      insuranceRenewalDate: formatToGds(insurance.expiry_date),
      neuteringConfirmed: formatToGds(cdo.registration.neutering_cConfirmed),
      microchipConfirmed: formatToGds(cdo.registration.microchip_confirmed),
      joinedInterimScheme: formatToGds(cdo.registration.joined_interim_scheme)
    }
  }
}

const extractEmail = (contacts) => {
  const email = contacts.filter(x => x.contact.contact_type_i === 2).map(y => y.contact.contact)
  return email.length > 0 ? email[0] : null
}

const extractTelephoneNumbers = (contacts) => {
  return contacts.filter(x => x.contact.contact_type_i === 1).sort(sortByIdAsc).map(y => y.contact.contact)
}

const extractLatestAddress = (addresses) => {
  if (addresses == null || addresses.length === 0) {
    return []
  }
  const latestAddress = addresses.sort(sortByAddressDesc)[0].address
  return [].concat(latestAddress.address_line_1, latestAddress.address_line_2, latestAddress.town, latestAddress.postcode).filter(el => el != null)
}

const extractLatestInsurance = (insurances) => {
  if (insurances == null || insurances.length === 0) {
    return {}
  }
  return insurances.sort(sortByIdDesc)[0]
}

const sortByIdAsc = (a, b) => {
  if (a.id < b.id) {
    return -1
  } else if (a.id > b.id) {
    return 1
  }
  return 0
}

const sortByIdDesc = (a, b) => {
  if (a.id > b.id) {
    return -1
  } else if (a.id < b.id) {
    return 1
  }
  return 0
}

const sortByAddressDesc = (a, b) => {
  if (a.address.id > b.address.id) {
    return -1
  } else if (a.address.id < b.address.id) {
    return 1
  }
  return 0
}

module.exports = ViewModel
