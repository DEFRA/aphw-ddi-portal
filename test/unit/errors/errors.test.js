const { ApiErrorFailure } = require('../../../app/errors/api-error-failure')
const { ApiConflictError } = require('../../../app/errors/api-conflict-error')
describe('errors', () => {
  describe('ApiErrorFailure', () => {
    test('should include the payload of the error', () => {
      const error = new ApiErrorFailure('409 Conflict', { error: 'Username already exists', message: 'Username already exists', statusCode: 409 })
      expect(error.name).toBe('ApiErrorFailure')
      expect(error.message).toBe('409 Conflict')
      expect(error.boom).toEqual({ error: 'Username already exists', message: 'Username already exists', statusCode: 409 })
    })
  })
  describe('ApiConflictError', () => {
    test('should include the payload of the error', () => {
      const apiErrorFailure = new ApiErrorFailure('409 Conflict', { error: 'Username already exists', message: 'Username already exists', statusCode: 409 })
      const error = new ApiConflictError(apiErrorFailure)
      expect(error.name).toBe('ApiConflictError')
      expect(error.message).toBe('409 Conflict')
      expect(error.boom).toEqual({ error: 'Username already exists', message: 'Username already exists', statusCode: 409 })
    })
  })
})
