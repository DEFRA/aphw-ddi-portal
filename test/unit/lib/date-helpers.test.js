const { getElapsed, formatToDateTime, getMonthsSince, dateComponentsToString } = require('../../../app/lib/date-helpers')

describe('date-helpers', () => {
  describe('getElapsed', () => {
    test('should handle invalid dates', () => {
      const elapsed = getElapsed(null, null)
      expect(elapsed).toEqual('00:00:00')
    })

    test('should handle zero difference', () => {
      const elapsed = getElapsed('2024-04-01T12:00:00.00000Z', '2024-04-01T12:00:00.00000Z')
      expect(elapsed).toEqual('00:00:00')
    })

    test('should handle difference when hours/mins/secs in single digits', () => {
      const elapsed = getElapsed('2024-04-01T13:02:03.00000Z', '2024-04-01T12:00:00.00000Z')
      expect(elapsed).toEqual('01:02:03')
    })

    test('should handle difference when hours/mins/secs in double digits', () => {
      const elapsed = getElapsed('2024-04-01T11:12:13.00000Z', '2024-04-01T01:00:00.00000Z')
      expect(elapsed).toEqual('10:12:13')
    })
  })

  describe('formatToDateTime', () => {
    test('should handle null dates', () => {
      const result = formatToDateTime(null)
      expect(result).toBe(null)
    })

    test('should handle undefined dates', () => {
      const result = formatToDateTime(undefined)
      expect(result).toBe(undefined)
    })

    test('should handle normal dates', () => {
      const result = formatToDateTime(new Date(2024, 5, 5, 10, 4, 1))
      expect(result).toBe('05 June 2024 10:04:01')
    })
  })

  describe('getMonthsSince', () => {
    test('should return value with "months" given over than one month', () => {
      const sinceMonth = new Date('2024-06-01')
      const date = new Date('2024-02-01')
      const result = getMonthsSince(date, sinceMonth)
      expect(result).toBe('4 months')
    })

    test('should return value with "month" given one month', () => {
      const sinceMonth = new Date('2024-06-01')
      const date = new Date('2024-05-02')
      const result = getMonthsSince(date, sinceMonth)
      expect(result).toBe('1 month')
    })

    test('should return Less than 1 month given less one month', () => {
      const sinceMonth = new Date('2024-06-01')
      const date = new Date('2024-05-03')
      const result = getMonthsSince(date, sinceMonth)
      expect(result).toBe('Less than 1 month')
    })

    test('should return Less than 1 month given time is now', () => {
      const date = new Date()
      const result = getMonthsSince(date)
      expect(result).toBe('Less than 1 month')
    })

    test('should return Less than 1 month given value is in the future', () => {
      const sinceMonth = new Date('2024-03-03')
      const date = new Date('2024-03-04')
      const result = getMonthsSince(date, sinceMonth)
      expect(result).toBe('Less than 1 month')
    })
  })

  describe('dateComponentsToString', () => {
    test('should construct date from components', () => {
      const result = dateComponentsToString({ 'pre-year': 2000, 'pre-month': 5, 'pre-day': 15 }, 'pre')
      expect(result).toBe('2000-5-15')
    })

    test('should handle undefined dates', () => {
      const result = dateComponentsToString({ 'missing-year': 2000, 'missing-month': 5, 'missing-day': 15 }, 'pre')
      expect(result).toBe('undefined-undefined-undefined')
    })
  })
})
