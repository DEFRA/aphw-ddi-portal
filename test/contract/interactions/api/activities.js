const Matchers = require('@pact-foundation/pact/dsl/matchers')

const activitiesEntry = {
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

const activitiesResponseSingleEntry = {
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

const getActivitiesInteraction = {
  state: 'activities returns list',
  uponReceiving: 'get activities',
  withRequest: {
    method: 'GET',
    path: '/activities/type/source'
  },
  willRespondWith: {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: {
      activities: Matchers.eachLike(activitiesEntry, null)
    }
  }
}

module.exports = {
  getActivitiesInteraction,
  activitiesResponseSingleEntry
}
