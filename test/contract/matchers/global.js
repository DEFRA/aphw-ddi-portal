const { Matchers } = require('@pact-foundation/pact')
const { string, term } = Matchers

const address = {
  addressLine1: string('14 Fake Street'),
  town: string('City of London'),
  postcode: string('E1 7AA'),
  country: term({ generate: 'England', matcher: 'England|Scotland|Wales' })
}

module.exports = {
  address
}
