const { Matchers } = require('@pact-foundation/pact')
const { string, like, iso8601DateTimeWithMillis, term, eachLike, iso8601Date } = Matchers

const ANY_EVENT = {
  operation: string('activity'),
  actioningUser: like({
    // username: 'Developer'
    displayname: 'Developer'
  }),
  timestamp: iso8601DateTimeWithMillis('2024-02-13T15:12:41.937Z'),
  type: term({
    matcher: 'uk.gov.defra.ddi.event.activity|uk.gov.defra.ddi.event.create|uk.gov.defra.ddi.event.update|uk.gov.defra.ddi.event.export',
    generate: 'uk.gov.defra.ddi.event.activity'
  }),
  rowKey: string('0a750a1a-bab9-41fb-beea-8e4ea2d842c1|1707837161937'),
  subject: string('DDI Activity Police correspondence')
}

const SAMPLE_ACTIVITY = {
  ...ANY_EVENT,
  type: 'uk.gov.defra.ddi.event.activity',
  operation: 'activity',
  activity: like({
    activity: '4',
    activityType: 'received',
    pk: 'ED300000',
    source: 'dog',
    activityDate: '2024-02-13T00:00:00.000Z',
    activityLabel: 'Police correspondence'
  }),
  subject: string('DDI Activity Police correspondence')
}

const SAMPLE_UPDATED_DOG = {
  ...ANY_EVENT,
  type: 'uk.gov.defra.ddi.event.update',
  operation: string('updated dog'),
  changes: {
    edited: eachLike([
      string('colour'),
      string('Brown'),
      string('Brown and white')
    ], { min: 1 })
  }
}

const SAMPLE_UPDATED_DOG_WITH_NULL = {
  ...ANY_EVENT,
  type: 'uk.gov.defra.ddi.event.update',
  operation: string('updated dog'),
  changes: {
    edited: eachLike([
      string('date_exported'),
      null,
      string('2024-01-01')
    ], { min: 1 })
  }
}

const SAMPLE_UPDATED_PERSON = {
  ...ANY_EVENT,
  type: 'uk.gov.defra.ddi.event.update',
  operation: string('updated person'),
  changes: {
    edited: eachLike([
      string('firstName'),
      string('Joseph'),
      string('Joe')
    ], { min: 1 })
  }
}

const SAMPLE_UPDATED_PERSON_NULL = {
  ...ANY_EVENT,
  type: 'uk.gov.defra.ddi.event.update',
  operation: string('updated person'),
  changes: {
    edited: eachLike([
      string('birthDate'),
      null,
      string('1990-01-01')
    ], { min: 1 })
  }
}

const CREATED_DOG = {
  id: 300002,
  dog_reference: 'a36ba664-9716-4b85-85cd-2b7cfe628cbb',
  index_number: 'ED300002',
  dog_breed_id: 2,
  status_id: 5,
  name: 'Jake',
  dog_breed: like({
    breed: 'Pit Bull Terrier'
  }),
  status: like({
    id: 5,
    status: 'Pre-exempt',
    status_type: 'STANDARD'
  }),
  registration: like({
    id: 3,
    dog_id: 300002,
    status_id: 1,
    police_force_id: 1,
    court_id: 31,
    exemption_order_id: 1,
    created_at: iso8601DateTimeWithMillis('2024-02-14T08:24:22.440Z'),
    cdo_issued: iso8601Date('2024-02-14'),
    cdo_expiry: iso8601Date('2024-04-14'),
    police_force: like({
      name: 'Avon and Somerset Constabulary'
    }),
    court: like({
      name: 'Bristol Magistrates\' Court'
    })
  })
}

const CREATED_DOG_V1 = {
  id: 300002,
  dog_reference: 'a36ba664-9716-4b85-85cd-2b7cfe628cbb',
  index_number: 'ED300002',
  dog_breed_id: 2,
  status_id: 5,
  name: 'Jake',
  dog_breed: like({
    breed: 'Pit Bull Terrier'
  }),
  status: like({
    id: 5,
    status: 'Pre-exempt',
    status_type: 'STANDARD'
  }),
  registration: like({
    id: 3,
    dog_id: 300002,
    status_id: 1,
    police_force_id: 1,
    court_id: 31,
    exemption_order_id: 1,
    created_on: iso8601DateTimeWithMillis('2024-02-14T08:24:22.440Z'),
    cdo_issued: iso8601Date('2024-02-14'),
    cdo_expiry: iso8601Date('2024-04-14'),
    police_force: like({
      name: 'Avon and Somerset Constabulary'
    }),
    court: like({
      name: 'Bristol Magistrates\' Court'
    })
  })
}
const SAMPLE_CREATED = {
  ...ANY_EVENT,
  type: 'uk.gov.defra.ddi.event.create',
  operation: string('created cdo'),
  created: {
    owner: like({
      id: 3,
      first_name: 'John',
      last_name: 'Jeffries',
      person_reference: 'P-57DC-2761',
      address: like({
        id: 5,
        address_line_1: 'FLAT 3, 3 THE LAUREATE, CHARLES STREET',
        town: 'BRISTOL',
        postcode: 'BS1 3DG',
        country_id: 1,
        country: like({
          country: 'England'
        })
      })
    })
  }
}

const SAMPLE_CREATED_WITH_DOG_V1 = {
  ...SAMPLE_CREATED,
  created: {
    ...SAMPLE_CREATED.created,
    dog: CREATED_DOG_V1
  }
}

const SAMPLE_CREATED_WITH_DOG = {
  ...SAMPLE_CREATED,
  created: {
    ...SAMPLE_CREATED.created,
    dog: CREATED_DOG
  }
}

const SAMPLE_CREATED_WITH_DOGS = {
  ...SAMPLE_CREATED,
  created: {
    ...SAMPLE_CREATED.created,
    dogs: eachLike(CREATED_DOG_V1, { min: 1 })
  }
}

module.exports = {
  ANY_EVENT,
  SAMPLE_ACTIVITY,
  SAMPLE_UPDATED_DOG,
  SAMPLE_UPDATED_DOG_WITH_NULL,
  SAMPLE_UPDATED_PERSON,
  SAMPLE_UPDATED_PERSON_NULL,
  CREATED_DOG,
  SAMPLE_CREATED,
  SAMPLE_CREATED_WITH_DOG,
  SAMPLE_CREATED_WITH_DOG_V1,
  SAMPLE_CREATED_WITH_DOGS
}
