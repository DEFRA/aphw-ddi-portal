const { eachLike } = require('@pact-foundation/pact/dsl/matchers')
const {
  SAMPLE_ACTIVITY, SAMPLE_UPDATED_DOG, SAMPLE_CREATED_WITH_DOGS, SAMPLE_CREATED_WITH_DOG, SAMPLE_UPDATED_PERSON,
  SAMPLE_UPDATED_DOG_WITH_NULL, SAMPLE_CREATED_WITH_DOG_V1, SAMPLE_UPDATED_PERSON_NULL
} = require('../../matchers/events')
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
      pks: 'ED300001'
    }
  },
  willRespondWith: {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: {
      events: eachLike(SAMPLE_UPDATED_DOG, { min: 1 })
    }
  }
}

const updatedDogExistsWithNullValues = {
  state: 'updated dog exists with null values',
  uponReceiving: 'get all events for primary key',
  withRequest: {
    method: 'GET',
    path: '/events',
    query: {
      pks: 'ED300003'
    }
  },
  willRespondWith: {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: {
      events: eachLike(SAMPLE_UPDATED_DOG_WITH_NULL, { min: 1 })
    }
  }
}

const updatedPersonExists = {
  state: 'updated person exists',
  uponReceiving: 'get all events for primary key',
  withRequest: {
    method: 'GET',
    path: '/events',
    query: {
      pks: 'P-B218-7D59'
    }
  },
  willRespondWith: {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: {
      events: eachLike(SAMPLE_UPDATED_PERSON, { min: 1 })
    }
  }
}

const updatedPersonExistsFromNull = {
  state: 'updated person exists with null values',
  uponReceiving: 'get all events for primary key',
  withRequest: {
    method: 'GET',
    path: '/events',
    query: {
      pks: 'P-B218-7D62'
    }
  },
  willRespondWith: {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: {
      events: eachLike(SAMPLE_UPDATED_PERSON_NULL, { min: 1 })
    }
  }
}

const createdDogWithOwnerV1 = {
  state: 'v1 created dog and owner exists with array of dogs',
  uponReceiving: 'get all events for primary key',
  withRequest: {
    method: 'GET',
    path: '/events',
    query: {
      pks: 'ED300002,P-B218-7D58'
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
  state: 'v2 created dog and owner exists with single dog',
  uponReceiving: 'get all events for primary key',
  withRequest: {
    method: 'GET',
    path: '/events',
    query: {
      pks: 'ED300004,P-B218-7D60'
    }
  },
  willRespondWith: {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: {
      events: eachLike(SAMPLE_CREATED_WITH_DOG_V1, { min: 1 })
    }
  }
}

const createdDogWithOwnerV3 = {
  state: 'v3 created dog with created_at',
  uponReceiving: 'get all events for primary key',
  withRequest: {
    method: 'GET',
    path: '/events',
    query: {
      pks: 'ED300005,P-B218-7D61'
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
  updatedDogExistsWithNullValues,
  updatedPersonExists,
  updatedPersonExistsFromNull,
  createdDogWithOwnerV1,
  createdDogWithOwnerV2,
  createdDogWithOwnerV3
}
