/**
 * @param {Partial<CdoDto>} [cdoPartial]
 * @returns {CdoDto}
 */
const buildCdo = (cdoPartial = {}) => ({
  exemption: {
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
    applicationFeePaid: '2023-09-10'
  },
  person: {
    id: 2,
    firstName: 'Bilbo',
    lastName: 'Baggins',
    organisationName: '',
    personReference: 'P-1234-567',
    person_contacts: [
      {
        contact_id: 1,
        id: 1,
        person_id: 2,
        contact: {
          contact_type: {
            id: 1,
            contact_type: 'email'
          },
          contact_type_id: 1,
          id: 1,
          contact: 'bilbo.baggins@shire.co.uk'
        }
      }
    ],
    addresses: [{
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
      }
    }]
  },
  dog: {
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
    breaches: []
  },
  ...cdoPartial
})

module.exports = {
  buildCdo
}
