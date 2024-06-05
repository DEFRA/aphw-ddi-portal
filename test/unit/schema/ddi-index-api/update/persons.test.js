const { UTCDate } = require('@date-fns/utc')

describe('Persons details validation', () => {
  const { personsFilter } = require('../../../../../app/schema/ddi-index-api/persons/get')

  test('should pass validation when payload valid', () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: new UTCDate('2020-02-01'),
      dobDay: 1,
      dobMonth: 2,
      dobYear: 1999
    }

    const { value } = personsFilter.validate(payload, { abortEarly: false, stripUnknown: true })

    expect(value).toMatchObject({
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '2020-02-01'
    })
  })

  test('should pass validation when payload with null DOB', () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: null
    }

    const { value } = personsFilter.validate(payload, { abortEarly: false, stripUnknown: true })

    expect(value).toMatchObject({
      firstName: 'John',
      lastName: 'Smith'
    })
  })

  test('should pass validation when payload with undefined DOB', () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith'
    }

    const { value } = personsFilter.validate(payload, { abortEarly: false, stripUnknown: true })

    expect(value).toMatchObject({
      firstName: 'John',
      lastName: 'Smith'
    })
  })

  test('should pass validation when payload with orphaned, sortKey and sortOrder', () => {
    const payload = {
      orphaned: 'true',
      sortKey: 'owner',
      sortOrder: 'ASC',
      limit: '-1'
    }

    const { value } = personsFilter.validate(payload, { abortEarly: false, stripUnknown: true })

    expect(value).toMatchObject({
      orphaned: true,
      sortKey: 'owner',
      sortOrder: 'ASC',
      limit: -1
    })
  })
})
