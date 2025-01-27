const buildCdoPersonAddress = (cdoPersonAddress = {}) => ({
  id: 1,
  person_id: 1,
  address_id: 1,
  address: {
    id: 1,
    address_line_1: 'Bag End',
    address_line_2: '',
    town: 'Hobbiton',
    postcode: 'SH1 0BB',
    county: 'The Shire',
    country_id: 1,
    country: {
      id: 1,
      country: 'England'
    }
  },
  ...cdoPersonAddress
})
/**
 * @typedef {{contact_type: {contact_type: string, id: number}, contact_type_id: number, contact: string, id: number}} CdoPersonContactContact
 */
/**
 *
 * @param {Partial<CdoPersonContactContact>} cdoPersonContactContact
 * @return {CdoPersonContactContact}
 */
const buildCdoPersonContactContact = (cdoPersonContactContact = {}) => ({
  contact_type: {
    id: 1,
    contact_type: 'Email'
  },
  contact_type_id: 1,
  id: 1,
  contact: 'bilbo.baggins@shire.co.uk',
  ...cdoPersonContactContact
})

/**
 * @typedef {{contact: {contact_type: {contact_type: string, id: number}, contact_type_id: number, contact: string, id: number}, id: number, contact_id: number, person_id: number}} CdoPersonContact
 */
/**
 *
 * @param {Partial<CdoPersonContact>} cdoPersonContact
 * @return {CdoPersonContact}
 */
const buildCdoPersonContact = (cdoPersonContact = {}) => ({
  contact_id: 1,
  id: 1,
  person_id: 2,
  contact: buildCdoPersonContactContact(),
  ...cdoPersonContact
})

const buildCdoPerson = (cdoPerson = {}) => ({
  id: 2,
  firstName: 'Bilbo',
  lastName: 'Baggins',
  organisationName: '',
  personReference: 'P-1234-567',
  person_contacts: [
    buildCdoPersonContact()
  ],
  addresses: [buildCdoPersonAddress()],
  ...cdoPerson
})

const buildCdoExemption = (cdoExemption = {}) => ({
  cdoExpiry: '9999-10-11T00:00:00.000Z',
  cdoIssued: '2023-10-11T00:00:00.000Z',
  certificateIssued: '2023-10-11T00:00:00.000Z',
  court: 'High Tribunal of Minas Tirith',
  exemptionOrder: '2015',
  insurance: [
    {
      insuranceRenewal: '9999-10-11',
      company: 'ShireSafe Pet Protection'
    }
  ],
  joinedExemptionScheme: '2023-10-11',
  legislationOfficer: 'Ranger Eothain',
  microchipVerification: '2023-10-10',
  neuteringConfirmation: '2023-10-08',
  nonComplianceLetterSent: null,
  policeForce: 'The Watchers of Anduin',
  applicationFeePaid: '2023-09-10',
  ...cdoExemption
})

const buildCdoDog = (cdoDog = {}) => ({
  name: 'Mithril',
  breed: 'XL Bully',
  colour: 'Azure',
  dateExported: null,
  dateOfBirth: null,
  dateOfDeath: null,
  dateStolen: null,
  dateUntraceable: null,
  dogReference: '',
  id: 1,
  indexNumber: '',
  microchipNumber: '123456789012345',
  microchipNumber2: '',
  sex: '',
  status: 'Pre-exempt',
  subStatus: '',
  tattoo: '',
  breaches: [],
  ...cdoDog
})

/**
 * @param {Partial<CdoDto>} [cdoPartial]
 * @returns {CdoDto}
 */
const buildCdo = (cdoPartial = {}) => ({
  exemption: buildCdoExemption(),
  person: buildCdoPerson(),
  dog: buildCdoDog(),
  ...cdoPartial
})

module.exports = {
  buildCdo,
  buildCdoExemption,
  buildCdoPerson,
  buildCdoDog,
  buildCdoPersonContactContact,
  buildCdoPersonContact,
  buildCdoPersonAddress
}
