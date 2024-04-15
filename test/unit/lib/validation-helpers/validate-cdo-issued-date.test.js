const { validateCdoIssueDate } = require('../../../../app/lib/validation-helpers')

const mockDateHelpers = {
  state: {
    path: ['cdoIssued'],
    ancestors: []
  },
  message: (a, b) => { return { error: a, elemName: b } }
}

describe('ValidationHelpers - validateCdoIssuedDate', () => {
  beforeEach(() => {
    mockDateHelpers.state.ancestors = [{ applicationType: 'cdo' }]
  })

  test('passes even if invalid date but not CDO check', () => {
    const value = { day: 'xx', month: 'yy', year: 'zzzz' }

    mockDateHelpers.state.ancestors = [
      { applicationType: 'not-cdo' }
    ]

    const res = validateCdoIssueDate(value, mockDateHelpers)

    expect(res).toBe(null)
  })

  test('errors for invalid date 1', () => {
    const value = { day: 'xx', month: 'yy', year: 'zzzz' }

    const res = validateCdoIssueDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['day', 'month', 'year']]
      },
      error: 'Enter a real date'
    })
  })

  test('errors for invalid date 2', () => {
    const value = { day: '01', month: 'yy', year: 'zzzz' }

    const res = validateCdoIssueDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['day', 'month', 'year']]
      },
      error: 'Enter a real date'
    })
  })

  test('errors for invalid date 3', () => {
    const value = { day: '01', month: '02', year: 'zzzz' }

    const res = validateCdoIssueDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['day', 'month', 'year']]
      },
      error: 'Enter a real date'
    })
  })

  test('errors for invalid date - missing day', () => {
    const value = { day: '', month: '02', year: '2024' }

    const res = validateCdoIssueDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['day']]
      },
      error: 'A CDO issue date must include a day'
    })
  })

  test('errors for invalid date - missing month', () => {
    const value = { day: '5', month: '', year: '2024' }

    const res = validateCdoIssueDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['month']]
      },
      error: 'A CDO issue date must include a month'
    })
  })

  test('errors for invalid date - missing year', () => {
    const value = { day: '5', month: '4', year: '' }

    const res = validateCdoIssueDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['year']]
      },
      error: 'A CDO issue date must include a year'
    })
  })

  test('errors for invalid date - missing day + year', () => {
    const value = { day: '', month: '4', year: '' }

    const res = validateCdoIssueDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['day', 'year']]
      },
      error: 'A CDO issue date must include a day and year'
    })
  })

  test('errors for invalid date - missing all elements', () => {
    const value = { day: '', month: '', year: '' }

    const res = validateCdoIssueDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['day', 'month', 'year']]
      },
      error: 'Enter a CDO issue date'
    })
  })

  test('errors if before 2020', () => {
    const value = { day: '31', month: '12', year: '2019' }

    const res = validateCdoIssueDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['year']]
      },
      error: 'The CDO issue year must be 2020 or later'
    })
  })

  test('errors for future date', () => {
    const value = { day: '01', month: '02', year: '2099' }

    const res = validateCdoIssueDate(value, mockDateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['day', 'month', 'year']]
      },
      error: 'Enter a date that is today or in the past'
    })
  })
})
