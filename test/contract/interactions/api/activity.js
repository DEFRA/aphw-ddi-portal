const Matchers = require('@pact-foundation/pact/dsl/matchers')
const { validActivityRequest, validActivityResponseMatcher } = require('../../matchers/activity')

const headers = {
  'ddi-username': 'test@example.com',
  'ddi-displayname': 'Example Tester',
  'Content-Type': 'application/json'
}

const activityEntry = {
  id: Matchers.integer(1),
  label: Matchers.string('Death of dog form'),
  display_order: Matchers.integer(1),
  activity_source: {
    id: Matchers.integer(1),
    name: Matchers.string('dog')
  },
  activity_type: {
    id: Matchers.integer(1),
    name: Matchers.string('sent')
  },
  activity_event: {
    id: Matchers.integer(1),
    target_primary_key: Matchers.string('dog')
  }
}

const activityResult = {
  id: 1,
  label: 'Death of dog form',
  display_order: 1,
  activity_source: {
    id: 1,
    name: 'dog'
  },
  activity_type: {
    id: 1,
    name: 'sent'
  },
  activity_event: {
    id: 1,
    target_primary_key: 'dog'
  }
}

const getActivityByIdInteraction = {
  state: 'activityById returns activity',
  uponReceiving: 'get activityById',
  withRequest: {
    method: 'GET',
    path: '/activity/1'
  },
  willRespondWith: {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: {
      activity: Matchers.like(activityEntry, null)
    }
  }
}

/**
 *
 * @returns {Interaction}
 */
const recordActivityInteraction = {
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

module.exports = {
  getActivityByIdInteraction,
  recordActivityInteraction,
  activityEntry,
  activityResult
}
