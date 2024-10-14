const { routes: ownerRoutes } = require('../../../constants/cdo/owner')
const { formatToGds } = require('../../../lib/date-helpers')
const { extractEmail, extractLatestAddress, extractLatestPrimaryTelephoneNumber, extractLatestSecondaryTelephoneNumber, formatAddressAsArray } = require('../../../lib/model-helpers')
const { getNewStatusLabel } = require('../../../lib/status-helper')

function ViewModel (cdo, backNav) {
  const person = cdo.person
  const contacts = person.person_contacts
  const insurance = cdo.exemption.insurance[0]
  const latestAddress = extractLatestAddress(person.addresses)

  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    showChangeAddressLink: false,
    dog: {
      id: cdo.dog.id,
      indexNumber: cdo.dog.indexNumber,
      status: getNewStatusLabel(cdo.dog),
      name: cdo.dog.name,
      breed: cdo.dog.breed,
      colour: cdo.dog.colour,
      sex: cdo.dog.sex,
      dateOfBirth: formatToGds(cdo.dog.dateOfBirth),
      dateOfDeath: formatToGds(cdo.dog.dateOfDeath),
      tattoo: cdo.dog.tattoo,
      microchipNumber: cdo.dog.microchipNumber,
      microchipNumber2: cdo.dog.microchipNumber2,
      dateExported: formatToGds(cdo.dog.dateExported),
      dateStolen: formatToGds(cdo.dog.dateStolen),
      dateUntraceable: formatToGds(cdo.dog.dateUntraceable),
      breaches: cdo.dog.breaches
    },
    person: {
      id: person.id,
      personReference: person.personReference,
      firstName: person.firstName,
      lastName: person.lastName,
      dateOfBirth: formatToGds(person.dateOfBirth),
      addressLines: formatAddressAsArray(latestAddress),
      country: latestAddress.country,
      email: extractEmail(contacts),
      telephoneNumber1: extractLatestPrimaryTelephoneNumber(contacts),
      telephoneNumber2: extractLatestSecondaryTelephoneNumber(contacts),
      navlink: {
        url: ownerRoutes.viewOwnerDetails.get,
        text: 'Owner record'
      },
      organisationName: person.organisationName
    },
    exemption: {
      certificateIssued: formatToGds(cdo.exemption.certificateIssued),
      cdoIssued: formatToGds(cdo.exemption.cdoIssued),
      cdoExpiry: formatToGds(cdo.exemption.cdoExpiry),
      court: cdo.exemption?.court,
      policeForce: cdo.exemption.policeForce,
      dogLegislationOfficer: cdo.exemption.legislationOfficer,
      applicationFeePaid: formatToGds(cdo.exemption.applicationFeePaid),
      insuranceCompany: insurance?.company,
      policyNumber: insurance?.policy_number,
      insuranceRenewalDate: formatToGds(insurance?.insuranceRenewal),
      neuteringConfirmation: formatToGds(cdo.exemption.neuteringConfirmation),
      microchipConfirmation: formatToGds(cdo.exemption.microchipConfirmation),
      joinedExemptionScheme: formatToGds(cdo.exemption.joinedExemptionScheme),
      exemptionOrder: cdo.exemption.exemptionOrder,
      microchipDeadline: formatToGds(cdo.exemption.microchipDeadline),
      neuteringDeadline: formatToGds(cdo.exemption.neuteringDeadline),
      typedByDlo: formatToGds(cdo.exemption.typedByDlo),
      withdrawn: formatToGds(cdo.exemption.withdrawn),
      microchipVerification: formatToGds(cdo.exemption.microchipVerification),
      nonComplianceLetterSent: formatToGds(cdo.exemption.nonComplianceLetterSent)
    }
  }
}

module.exports = ViewModel
