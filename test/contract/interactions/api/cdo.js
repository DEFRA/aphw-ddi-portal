const {
  validCdoRequest, validCdoResponseMatcher, validCdoRequestWithCountry, validCdoRequestWithPersonReference,
  validCdoResponseWithPersonReferenceMatcher
} = require('../../matchers/cdo')

const headers = {
  'ddi-username': 'test@example.com',
  'ddi-displayname': 'Example Tester',
  'Content-Type': 'application/json'
}

/**
 *
 * @param {Partial<Interaction>} partialInteraction
 * @returns {Interaction}
 */
const createInteraction = (partialInteraction) => {
  return {
    ...partialInteraction,
    withRequest: {
      method: 'POST',
      path: '/cdo',
      body: validCdoRequest,
      headers,
      ...partialInteraction.withRequest
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: validCdoResponseMatcher,
      ...partialInteraction.willRespondWith
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
