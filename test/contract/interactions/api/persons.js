const Matchers = require('@pact-foundation/pact/dsl/matchers')

const person = {
  firstName: Matchers.string('Homer'),
  lastName: Matchers.string('Simpson'),
  birthDate: Matchers.string('1998-05-10'),
  personReference: Matchers.string('P-6076-A37C'),
  address: {
    addressLine1: Matchers.string('14 Fake Street'),
    addressLine2: Matchers.string(null),
    town: Matchers.string('City of London'),
    postcode: Matchers.string('E1 7AA'),
    country: Matchers.string('England')
  }
}

/**
 * @type {import('@pact-foundation/pact').InteractionObject | import('@pact-foundation/pact').Interaction}
 */
const getPersonsFirstNameLastNameInteraction = {
  state: 'aphw-ddi-api has a matching person Homer Simpson P-6076-A37C',
  uponReceiving: 'request to get a list of matching persons with firstName and lastname',
  withRequest: {
    method: 'GET',
    path: '/persons',
    query: {
      firstName: 'Homer',
      lastName: 'Simpson'
    }
  },
  willRespondWith: {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: {
      persons: Matchers.eachLike(person, null)
    }
  }
}

const getPersonsFirstNameLastNameDOBInteraction = {
  state: 'aphw-ddi-api has a matching person Homer Simpson P-6076-A37C 1998-05-10',
  uponReceiving: 'request to get a list of matching persons with firstName, lastName and DOB',
  withRequest: {
    method: 'GET',
    path: '/persons',
    query: {
      firstName: 'Homer',
      lastName: 'Simpson',
      dateOfBirth: '1998-05-10'
    }
  },
  willRespondWith: {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: {
      persons: Matchers.eachLike(person, null)
    }
  }
}

module.exports = {
  getPersonsFirstNameLastNameInteraction,
  getPersonsFirstNameLastNameDOBInteraction
}
