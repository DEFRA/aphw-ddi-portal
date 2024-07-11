const { Matchers } = require('@pact-foundation/pact')
const { term, string, iso8601Date, eachLike } = Matchers
const { address } = require('./global')

const validCdoRequest = {
  owner: {
    firstName: 'Shaun',
    lastName: 'Fitzsimons',
    dateOfBirth: '1998-05-10',
    address: {
      addressLine1: '14 Fake Street',
      town: 'City of London',
      postcode: 'E1 7AA'
    }
  },
  enforcementDetails: {
    legislationOfficer: 'Sidney Lewis',
    policeForce: '1',
    court: '1'
  },
  dogs: [{
    breed: 'Pit Bull Terrier',
    name: 'Jackie',
    applicationType: 'cdo',
    cdoIssued: '2023-10-10T00:00:00.000Z',
    cdoExpiry: '2023-12-10T00:00:00.000Z'
  }]
}

const validCdoResponseMatcher = {
  owner: {
    firstName: string('Shaun'),
    lastName: string('Fitzsimons'),
    birthDate: iso8601Date('1998-05-10'),
    address
  },
  enforcementDetails: {
    policeForce: string('Avon and Somerset Constabulary'),
    court: string('Aberystwyth Justice Centre'),
    legislationOfficer: string('Sidney Lewis')
  },
  dogs: eachLike({
    indexNumber: string('ED300041'),
    name: string('Jackie'),
    status: string('Pre-exempt'),
    breed: string('Pit Bull Terrier'),
    cdoIssued: iso8601Date('2023-10-10'),
    cdoExpiry: iso8601Date('2023-12-10')
  })
}

const validCdoResponseWithPersonReferenceMatcher = {
  ...validCdoResponseMatcher,
  owner: {
    ...validCdoResponseMatcher.owner,
    personReference: string('P-6076-A37C')
  }
}

const validCdoRequestWithCountry = {
  owner: {
    firstName: 'Homer',
    lastName: 'Simpson',
    dateOfBirth: '1998-05-10',
    address: {
      addressLine1: '1 Anywhere St',
      addressLine2: 'Anywhere Estate',
      town: 'Pontypridd',
      postcode: 'CF15 7SU',
      country: 'Wales'
    }
  },
  enforcementDetails: {
    court: '1',
    policeForce: '1',
    legislationOfficer: 'Sidney Lewis'
  },
  dogs: [
    {
      breed: 'XL Bully',
      name: 'Rex',
      applicationType: 'cdo',
      cdoIssued: '2023-10-10T00:00:00.000Z',
      cdoExpiry: '2023-12-10T00:00:00.000Z'
    }
  ]
}

const validCdoRequestWithPersonReference = {
  ...validCdoRequestWithCountry,
  owner: {
    ...validCdoRequestWithCountry.owner,
    personReference: 'P-D9E1-22AD'
  }
}

const validCdoResponseWithCountryMatcher = {
  owner: {
    firstName: string('Homer'),
    lastName: string('Simpson'),
    dateOfBirth: iso8601Date('1998-05-10'),
    address: {
      addressLine1: string('1 Anywhere St'),
      addressLine2: string('Anywhere Estate'),
      town: string('Pontypridd'),
      postcode: string('CF15 7SU'),
      country: term({ generate: 'Wales', matcher: 'England|Scotland|Wales' })
    }
  },
  enforcementDetails: {
    policeForce: string('Avon and Somerset Constabulary'),
    court: string('Aberystwyth Justice Centre'),
    legislationOfficer: string('Sidney Lewis')
  },
  dogs: eachLike({
    indexNumber: string('ED300041'),
    name: string('Rex'),
    status: string('Interim exempt'),
    breed: string('XL Bully'),
    cdoIssued: iso8601Date('2023-10-10'),
    cdoExpiry: iso8601Date('2023-12-10')
  })
}

module.exports = {
  validCdoRequest,
  validCdoRequestWithCountry,
  validCdoRequestWithPersonReference,
  validCdoResponseMatcher,
  validCdoResponseWithCountryMatcher,
  validCdoResponseWithPersonReferenceMatcher
}
