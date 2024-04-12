const { validateOwnerDateOfBirth } = require('../../../../app/lib/validation-helpers')

const mockDateHelpers = {
  state: {
    path: ['interimExemption'],
    ancestors: []
  },
  message: (a, b) => { return { error: a, elemName: b } }
}

describe('ValidationHelpers - validateOwnerDateOfBirth', () => {
  test('errors for invalid date 1', () => {
    const value = { day: 'xx', month: 'yy', year: 'zzzz' }

    const res = validateOwnerDateOfBirth(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['birthDate', ['day', 'month', 'year']]
      },
      error: 'Enter a real date'
    })
  })

  test('errors for invalid date 2', () => {
    const value = { day: '01', month: 'yy', year: 'zzzz' }

    const res = validateOwnerDateOfBirth(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['birthDate', ['day', 'month', 'year']]
      },
      error: 'Enter a real date'
    })
  })

  test('errors for invalid date 3', () => {
    const value = { day: '01', month: '02', year: 'zzzz' }

    const res = validateOwnerDateOfBirth(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['birthDate', ['day', 'month', 'year']]
      },
      error: 'Enter a real date'
    })
  })

  test('errors for invalid date - missing day', () => {
    const value = { day: '', month: '02', year: '2024' }

    const res = validateOwnerDateOfBirth(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['birthDate', ['day']]
      },
      error: 'An owner date of birth must include a day'
    })
  })

  test('errors for invalid date - missing month', () => {
    const value = { day: '5', month: '', year: '2024' }

    const res = validateOwnerDateOfBirth(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['birthDate', ['month']]
      },
      error: 'An owner date of birth must include a month'
    })
  })

  test('errors for invalid date - missing year', () => {
    const value = { day: '5', month: '4', year: '' }

    const res = validateOwnerDateOfBirth(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['birthDate', ['year']]
      },
      error: 'An owner date of birth must include a year'
    })
  })

  test('errors for invalid date - missing day + year', () => {
    const value = { day: '', month: '4', year: '' }

    const res = validateOwnerDateOfBirth(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['birthDate', ['day', 'year']]
      },
      error: 'An owner date of birth must include a day and year'
    })
  })

  test('errors if before 2020', () => {
    const value = { day: '31', month: '12', year: '2022' }

    const res = validateOwnerDateOfBirth(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['birthDate', ['day', 'month', 'year']]
      },
      error: 'The dog owner must be aged 16 or over'
    })
  })

  test('errors for future date', () => {
    const value = { day: '01', month: '02', year: '2099' }

    const res = validateOwnerDateOfBirth(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['birthDate', ['day', 'month', 'year']]
      },
      error: 'Enter a date of birth that is in the past'
    })
  })
})
