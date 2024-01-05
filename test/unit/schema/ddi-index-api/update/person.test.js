const { UTCDate } = require('@date-fns/utc')

describe('Person details validation', () => {
  const { schema } = require('../../../../../app/schema/ddi-index-api/person/update')

  test('should pass validation when payload valid', () => {
    const payload = {
      personReference: 'P-123',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: new UTCDate('2020-02-01'),
      address: {
        addressLine1: '1 Test Street',
        town: 'Testington',
        postcode: 'TS1 1TS'
      }
    }

    const { value } = schema.validate(payload, { abortEarly: false })

    expect(value).toMatchObject({
      personReference: 'P-123',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: new UTCDate('2020-02-01'),
      address: {
        addressLine1: '1 Test Street',
        town: 'Testington',
        postcode: 'TS1 1TS'
      }
    })
  })

  test('should fail validation with invalid payload', () => {
    const payload = {
      personReference: 'P-123',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: new UTCDate('2020-02-01'),
      address: {
        addressLine1: '1 Test Street',
        town: 'Testington'
      }
    }

    const { error } = schema.validate(payload, { abortEarly: false })
    expect(error).not.toBe(null)
    expect(error.details[0].message).toBe('"address.postcode" is required')
  })
})
