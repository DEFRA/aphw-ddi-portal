const { UTCDate } = require('@date-fns/utc')

describe('Dog details validation', () => {
  const { validatePayload } = require('../../../../../app/schema/portal/edit/dog-details')

  test('should pass validation when payload valid', () => {
    const payload = {
      id: 1,
      indexNumber: 'ED1',
      name: 'Fido',
      breed: 'Breed 1',
      'dateOfBirth-day': '01',
      'dateOfBirth-month': '01',
      'dateOfBirth-year': '2020'
    }

    const value = validatePayload(payload)

    expect(value).toMatchObject({
      name: 'Fido',
      breed: 'Breed 1',
      dateOfBirth: new UTCDate('2020-01-01')
    })
  })

  test('should fail validation with invalid date', () => {
    const payload = {
      id: 1,
      indexNumber: 'ED1',
      name: 'Fido',
      breed: 'Breed 1',
      'dateOfBirth-day': '30',
      'dateOfBirth-month': '02',
      'dateOfBirth-year': '2020'
    }

    expect(() => validatePayload(payload)).toThrow()
  })

  test('should fail validation with dob in the future', () => {
    const payload = {
      id: 1,
      indexNumber: 'ED1',
      name: 'Fido',
      breed: 'Breed 1',
      'dateOfBirth-day': '01',
      'dateOfBirth-month': '01',
      'dateOfBirth-year': '2029'
    }

    expect(() => validatePayload(payload)).toThrow()
  })

  test('should fail validation with invalid microchip 1', () => {
    const payload = {
      id: 1,
      indexNumber: 'ED1',
      name: 'Fido',
      breed: 'Breed 1',
      'dateOfBirth-day': '30',
      'dateOfBirth-month': '01',
      'dateOfBirth-year': '2020',
      microchipNumber: 'abc$123'
    }

    expect(() => validatePayload(payload)).toThrow()
  })

  test('should fail validation with invalid microchip 2', () => {
    const payload = {
      id: 1,
      indexNumber: 'ED1',
      name: 'Fido',
      breed: 'Breed 1',
      'dateOfBirth-day': '30',
      'dateOfBirth-month': '01',
      'dateOfBirth-year': '2020',
      microchipNumber: 'abc123',
      microchipNumber2: 'def$456'
    }

    expect(() => validatePayload(payload)).toThrow()
  })
})
