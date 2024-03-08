const {
  validActivityRequest, validActivityResponseMatcher
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
const recordActivityInteraction = () => {
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

module.exports = {
  recordActivityInteraction
}
