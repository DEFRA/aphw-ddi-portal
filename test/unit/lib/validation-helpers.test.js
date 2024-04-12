const { validateMicrochip, validateCdoIssueDate } = require('../../../app/lib/validation-helpers')

const mockMicrochipHelpers = {
  state: {
    path: ['microchipNumber'],
    ancestors: []
  },
  message: (a, b) => { return { error: a, elemName: b } }
}

const mockDateHelpers = {
  state: {
    path: ['cdoIssued'],
    ancestors: []
  },
  message: (a, b) => { return { error: a, elemName: b } }
}

let microchipHelpers
let dateHelpers

describe('ValidationHelpers', () => {
  beforeEach(() => {
    microchipHelpers = mockMicrochipHelpers
    dateHelpers = mockDateHelpers
  })

  test('validateMicrochip handles valid microchip', () => {
    const value = '123456789012345'

    const res = validateMicrochip(value, microchipHelpers, false)

    expect(res).toBe('123456789012345')
  })

  test('validateMicrochip gives error if invalid microchip 1', () => {
    const value = '12345678901234x'

    const res = validateMicrochip(value, microchipHelpers, false)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip numbers can only contain numbers'
    })
  })

  test('validateMicrochip gives error if invalid microchip 2', () => {
    const value = '123456-78'

    const res = validateMicrochip(value, microchipHelpers, false)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip numbers can only contain numbers'
    })
  })

  test('validateMicrochip gives error if invalid microchip 3', () => {
    const value = '123456 78'

    const res = validateMicrochip(value, microchipHelpers, false)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip numbers can only contain numbers'
    })
  })

  test('validateMicrochip allows invalid microchip if no change from original microchip', () => {
    const value = '123456x78'

    microchipHelpers.state.ancestors = [
      { origMicrochipNumber: '123456x78' }
    ]

    const res = validateMicrochip(value, microchipHelpers, true)

    expect(res).toBe('123456x78')
  })

  test('validateMicrochip fails invalid microchip if some change from original microchip', () => {
    const value = '123456x78'

    microchipHelpers.state.ancestors = [
      { origMicrochipNumber: '123456x7899' }
    ]

    const res = validateMicrochip(value, microchipHelpers, true)

    expect(res).toEqual({
      elemName: {
        path: ['MicrochipNumber']
      },
      error: 'Microchip numbers can only contain numbers'
    })
  })

  test('validateCdoIssuedDate passes even if invalid date but not CDO check', () => {
    const value = { day: 'xx', month: 'yy', year: 'zzzz' }

    dateHelpers.state.ancestors = [
      { applicationType: 'not-cdo' }
    ]

    const res = validateCdoIssueDate(value, dateHelpers)

    expect(res).toBe(null)
  })

  test('validateCdoIssuedDate errors for invalid date 1', () => {
    const value = { day: 'xx', month: 'yy', year: 'zzzz' }

    dateHelpers.state.ancestors = [
      { applicationType: 'cdo' }
    ]

    const res = validateCdoIssueDate(value, dateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['day', 'month', 'year']]
      },
      error: 'Enter a real date'
    })
  })

  test('validateCdoIssuedDate errors for invalid date 2', () => {
    const value = { day: '01', month: 'yy', year: 'zzzz' }

    dateHelpers.state.ancestors = [
      { applicationType: 'cdo' }
    ]

    const res = validateCdoIssueDate(value, dateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['day', 'month', 'year']]
      },
      error: 'Enter a real date'
    })
  })

  test('validateCdoIssuedDate errors for invalid date 3', () => {
    const value = { day: '01', month: '02', year: 'zzzz' }

    dateHelpers.state.ancestors = [
      { applicationType: 'cdo' }
    ]

    const res = validateCdoIssueDate(value, dateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['day', 'month', 'year']]
      },
      error: 'Enter a real date'
    })
  })

  test('validateCdoIssuedDate errors for invalid date - missing day', () => {
    const value = { day: '', month: '02', year: '2024' }

    dateHelpers.state.ancestors = [
      { applicationType: 'cdo' }
    ]

    const res = validateCdoIssueDate(value, dateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['day']]
      },
      error: 'A CDO issue date must include a day'
    })
  })

  test('validateCdoIssuedDate errors for invalid date - missing month', () => {
    const value = { day: '5', month: '', year: '2024' }

    dateHelpers.state.ancestors = [
      { applicationType: 'cdo' }
    ]

    const res = validateCdoIssueDate(value, dateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['month']]
      },
      error: 'A CDO issue date must include a month'
    })
  })

  test('validateCdoIssuedDate errors for invalid date - missing year', () => {
    const value = { day: '5', month: '4', year: '' }

    dateHelpers.state.ancestors = [
      { applicationType: 'cdo' }
    ]

    const res = validateCdoIssueDate(value, dateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['year']]
      },
      error: 'A CDO issue date must include a year'
    })
  })

  test('validateCdoIssuedDate errors for invalid date - missing day + year', () => {
    const value = { day: '', month: '4', year: '' }

    dateHelpers.state.ancestors = [
      { applicationType: 'cdo' }
    ]

    const res = validateCdoIssueDate(value, dateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['day', 'year']]
      },
      error: 'A CDO issue date must include a day and year'
    })
  })

  test('validateCdoIssuedDate errors if before 2020', () => {
    const value = { day: '31', month: '12', year: '2019' }

    dateHelpers.state.ancestors = [
      { applicationType: 'cdo' }
    ]

    const res = validateCdoIssueDate(value, dateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['year']]
      },
      error: 'The CDO issue year must be 2020 or later'
    })
  })

  test('validateCdoIssuedDate errors for future date', () => {
    const value = { day: '01', month: '02', year: '2099' }

    dateHelpers.state.ancestors = [
      { applicationType: 'cdo' }
    ]

    const res = validateCdoIssueDate(value, dateHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['cdoIssued', ['day', 'month', 'year']]
      },
      error: 'Enter a date that is today or in the past'
    })
  })
})
