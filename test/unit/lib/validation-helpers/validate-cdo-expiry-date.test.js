const { calculateCdoExpiryDate } = require('../../../../app/lib/validation-helpers')

describe('ValidationHelpers - validateCdoExpiryDate', () => {
  test('errors for missing date', () => {
    const value = { day: '', month: '', year: '' }

    const res = calculateCdoExpiryDate(value)

    expect(res).toEqual(null)
  })

  test('adds to months to valid date', () => {
    const value = { day: '5', month: '3', year: '2020' }

    const res = calculateCdoExpiryDate(value)

    expect(res).toEqual(new Date(2020, 4, 5))
  })
})
