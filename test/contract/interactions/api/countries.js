const Matchers = require('@pact-foundation/pact/dsl/matchers')

const getCountriesInteraction = {
  state: 'countries exist',
  uponReceiving: 'get all countries',
  withRequest: {
    method: 'GET',
    path: '/countries'
  },
  willRespondWith: {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: {
      countries: Matchers.eachLike('England', null)
    }
  }
}

module.exports = {
  getCountriesInteraction
}
