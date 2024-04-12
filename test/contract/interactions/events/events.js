const { eachLike } = require('@pact-foundation/pact/dsl/matchers')
const { SAMPLE_ACTIVITY, SAMPLE_UPDATED, SAMPLE_CREATED_WITH_DOGS, SAMPLE_CREATED_WITH_DOG } = require('../../matchers/events')
const activityEventExists = {
  state: 'activity event exists',
  uponReceiving: 'get all events for primary key',
  withRequest: {
    method: 'GET',
    path: '/events',
    query: {
      pks: 'ED300000'
    }
  },
  willRespondWith: {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: {
      events: eachLike(SAMPLE_ACTIVITY, { min: 1 })
    }
  }
}

const updatedDogExists = {
  state: 'updated dog exists',
  uponReceiving: 'get all events for primary key',
  withRequest: {
    method: 'GET',
    path: '/events',
    query: {
      pks: 'ED300000'
    }
  },
  willRespondWith: {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: {
      events: eachLike(SAMPLE_UPDATED, { min: 1 })
    }
  }
}

const createdDogWithOwnerV1 = {
  state: 'v1 created dog and owner exists',
  uponReceiving: 'get all events for primary key',
  withRequest: {
    method: 'GET',
    path: '/events',
    query: {
      pks: 'ED300000,P-B218-7D57'
    }
  },
  willRespondWith: {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: {
      events: eachLike(SAMPLE_CREATED_WITH_DOGS, { min: 1 })
    }
  }
}
const createdDogWithOwnerV2 = {
  state: 'v2 created dog and owner exists',
  uponReceiving: 'get all events for primary key',
  withRequest: {
    method: 'GET',
    path: '/events',
    query: {
      pks: 'ED300000,P-B218-7D57'
    }
  },
  willRespondWith: {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: {
      events: eachLike(SAMPLE_CREATED_WITH_DOG, { min: 1 })
    }
  }
}

module.exports = {
  activityEventExists,
  updatedDogExists,
  createdDogWithOwnerV1,
  createdDogWithOwnerV2
}
