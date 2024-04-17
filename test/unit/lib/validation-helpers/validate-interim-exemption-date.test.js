const { validateInterimExemptionDate } = require('../../../../app/lib/validation-helpers')

const mockDateHelpers = {
  state: {
    path: ['interimExemption'],
    ancestors: []
  },
  message: (a, b) => { return { error: a, elemName: b } }
}

describe('ValidationHelpers - validateInterimExemptionDate', () => {
  beforeEach(() => {
    mockDateHelpers.state.ancestors = [{ applicationType: 'interim-exemption' }]
  })

  test('passes even if invalid date but not interim check', () => {
    const value = { day: 'xx', month: 'yy', year: 'zzzz' }

    mockDateHelpers.state.ancestors = [
      { applicationType: 'not-interim-exemption' }
    ]

    const res = validateInterimExemptionDate(value, mockDateHelpers)

    expect(res).toBe(null)
  })

  test('errors for invalid date 1', () => {
    const value = { day: 'xx', month: 'yy', year: 'zzzz' }

    const res = validateInterimExemptionDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['interimExemption', ['day', 'month', 'year']]
      },
      error: 'Enter a real date'
    })
  })

  test('errors for invalid date 2', () => {
    const value = { day: '01', month: 'yy', year: 'zzzz' }

    const res = validateInterimExemptionDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['interimExemption', ['day', 'month', 'year']]
      },
      error: 'Enter a real date'
    })
  })

  test('errors for invalid date 3', () => {
    const value = { day: '01', month: '02', year: 'zzzz' }

    const res = validateInterimExemptionDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['interimExemption', ['day', 'month', 'year']]
      },
      error: 'Enter a real date'
    })
  })

  test('errors for invalid date - missing day', () => {
    const value = { day: '', month: '02', year: '2024' }

    const res = validateInterimExemptionDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['interimExemption', ['day']]
      },
      error: 'Date joined scheme must include a day'
    })
  })

  test('errors for invalid date - missing month', () => {
    const value = { day: '5', month: '', year: '2024' }

    const res = validateInterimExemptionDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['interimExemption', ['month']]
      },
      error: 'Date joined scheme must include a month'
    })
  })

  test('errors for invalid date - missing year', () => {
    const value = { day: '5', month: '4', year: '' }

    const res = validateInterimExemptionDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['interimExemption', ['year']]
      },
      error: 'Date joined scheme must include a year'
    })
  })

  test('errors for invalid date - missing day + year', () => {
    const value = { day: '', month: '4', year: '' }

    const res = validateInterimExemptionDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['interimExemption', ['day', 'year']]
      },
      error: 'Date joined scheme must include a day and year'
    })
  })

  test('errors for invalid date - missing all elements', () => {
    const value = { day: '', month: '', year: '' }

    const res = validateInterimExemptionDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['interimExemption', ['day', 'month', 'year']]
      },
      error: 'Enter a Date joined scheme'
    })
  })

  test('errors if before 2020', () => {
    const value = { day: '31', month: '12', year: '2022' }

    const res = validateInterimExemptionDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['interimExemption', ['year']]
      },
      error: 'Date joined scheme year must be within the last 12 months'
    })
  })

  test('errors for future date', () => {
    const value = { day: '01', month: '02', year: '2099' }

    const res = validateInterimExemptionDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['interimExemption', ['day', 'month', 'year']]
      },
      error: 'Enter a date that is today or in the past'
    })
  })
})
