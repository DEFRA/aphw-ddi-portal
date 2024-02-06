const { UTCDate } = require('@date-fns/utc')

describe('Dog details validation', () => {
  const { validatePayload } = require('../../../../../app/schema/portal/cdo/dog-details')

  test('should pass validation when payload valid for type cdo', () => {
    const payload = {
      name: 'Fido',
      breed: 'Breed 1',
      applicationType: 'cdo',
      'cdoIssued-day': '01',
      'cdoIssued-month': '01',
      'cdoIssued-year': '2020'
    }

    const value = validatePayload(payload)

    expect(value).toMatchObject({
      name: 'Fido',
      breed: 'Breed 1',
      cdoIssued: new UTCDate('2020-01-01'),
      cdoExpiry: new UTCDate('2020-03-01')
    })
  })

  test('should pass validation when payload valid for type interim exemption', () => {
    const today = new Date(new Date().toDateString())

    const payload = {
      breed: 'Breed 1',
      name: 'Fido',
      applicationType: 'interim-exemption',
      'interimExemption-day': `${today.getDate()}`,
      'interimExemption-month': `${today.getMonth() + 1}`,
      'interimExemption-year': `${today.getFullYear()}`,
      cdoExpiry: new Date()
    }

    const value = validatePayload(payload)

    expect(value).toMatchObject({
      name: 'Fido',
      breed: 'Breed 1',
      interimExemption: today
    })
  })

  test('should fail validation with invalid date', () => {
    const payload = {
      name: 'Fido',
      breed: 'Breed 1',
      applicationType: 'cdo',
      'cdoIssued-day': '30',
      'cdoIssued-month': '02',
      'cdoIssued-year': '2020'
    }

    expect(() => validatePayload(payload)).toThrow()
  })

  test('should fail validation with year before 2020', () => {
    const payload = {
      name: 'Fido',
      breed: 'Breed 1',
      applicationType: 'cdo',
      'cdoIssued-day': '01',
      'cdoIssued-month': '01',
      'cdoIssued-year': '2019'
    }

    expect(() => validatePayload(payload)).toThrow()
  })
})
