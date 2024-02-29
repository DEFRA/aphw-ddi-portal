const { term, eachLike, like, string, iso8601Date } = require('@pact-foundation/pact/dsl/matchers')
const { anyIntegerString } = require('./custom')

const validCdoMatcher = {
  owner: {
    firstName: string('Shaun'),
    lastName: string('Fitzsimons'),
    address: like({
      addressLine1: '14 Fake Street',
      town: string('City of London'),
      postcode: string('E1 7AA')
    })
  },
  enforcementDetails: {
    legislationOfficer: string('Joe Bloggs'),
    policeForce: anyIntegerString('1'),
    court: anyIntegerString('1')
  },
  dogs: eachLike({
    breed: string('Pit Bull Terrier'),
    name: string(''),
    applicationType: term({ generate: 'cdo', matcher: 'cdo|Interim Exemption' })
  })
}

const validCdoMatcherWithCountry = {
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
    court: anyIntegerString('1'),
    policeForce: anyIntegerString('1'),
    legislationOfficer: string('Sidney Lewis')
  },
  dogs: [
    {
      breed: string('XL Bully'),
      name: string('Rex'),
      applicationType: term({ generate: 'cdo', matcher: 'cdo|Interim Exemption' }),
      cdoIssued: iso8601Date('2023-10-10'),
      cdoExpiry: iso8601Date('2023-12-10')
    }
  ]
}

module.exports = {
  validCdoMatcher,
  validCdoMatcherWithCountry
}
