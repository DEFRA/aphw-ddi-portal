const {
  validActivityRequest
} = require('../../matchers/activity')

const headers = {
  'ddi-username': 'test@example.com',
  'ddi-displayname': 'Example Tester',
  'Content-Type': 'application/json'
}

/**
 *
 * @returns {Interaction}
 */
const createInteraction = () => {
  return {
      state: 'activity has mandatory data',
      uponReceiving: 'submission to POST activity data',
      withRequest: {
        method: 'POST',
        path: '/activity',
        body: validActivityRequest,
        headers
      },
      willRespondWith: {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: validActivityResponseMatcher
      }
    }
  }
}

const postCdoWithoutCountryInteraction = createInteraction({
  state: 'cdo has only mandatory data',
  uponReceiving: 'submission to POST cdo data',
  withRequest: {
    body: validCdoRequest
  },
  willRespondWith: {
    body: validCdoResponseMatcher
  }
})

const postCdoWithCountryInteraction = createInteraction({
  state: 'cdo includes optional data and country',
  uponReceiving: 'submission to POST cdo data',
  withRequest: {
    body: validCdoRequestWithCountry
  },
  willRespondWith: {
    body: validCdoResponseMatcher
  }
})

const postCdoWithOwnerLookupInteraction = createInteraction({
  state: 'owner already exists in the db',
  uponReceiving: 'submission to POST cdo data with an owner ',
  withRequest: {
    body: validCdoRequestWithPersonReference
  },
  willRespondWith: {
    body: validCdoResponseWithPersonReferenceMatcher
  }
})

module.exports = {
  postCdoWithCountryInteraction,
  postCdoWithoutCountryInteraction,
  postCdoWithOwnerLookupInteraction
}
