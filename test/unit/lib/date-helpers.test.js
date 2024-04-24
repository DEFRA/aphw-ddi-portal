const { getElapsed, formatToDateTime } = require('../../../app/lib/date-helpers')

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
})
