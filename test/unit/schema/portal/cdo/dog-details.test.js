const { UTCDate } = require('@date-fns/utc')

describe('Dog details validation', () => {
  const { validatePayload } = require('../../../../../app/schema/portal/cdo/dog-details')

  test('should pass validation when payload valid', () => {
    const payload = {
      name: 'Fido',
      breed: 'Breed 1',
      'cdoIssued-day': '01',
      'cdoIssued-month': '01',
      'cdoIssued-year': '2019'
    }

    const value = validatePayload(payload)

    expect(value).toMatchObject({
      name: 'Fido',
      breed: 'Breed 1',
      cdoIssued: new UTCDate('2019-01-01'),
      cdoExpiry: new UTCDate('2019-03-01')
    })
  })

  test('should fail validation with invalid date', () => {
    const payload = {
      name: 'Fido',
      breed: 'Breed 1',
      'cdoIssued-day': '30',
      'cdoIssued-month': '02',
      'cdoIssued-year': '2020'
    }

    expect(() => validatePayload(payload)).toThrow()
  })
})
