const jwt = require('jsonwebtoken')
describe('jwt-utils', () => {
  describe('generateToken', () => {
    jest.mock('../../../app/lib/environment-helpers')
    const { getEnvironmentVariable } = require('../../../app/lib/environment-helpers')
    getEnvironmentVariable.mockImplementation((envVar) => {
      if (envVar === 'PRIVATE_KEY') {
        return 'abcdedfgh'
      }
      return process.env[envVar]
    })

    const { generateToken } = require('../../../app/auth/jwt-utils')

    test('should generate a token', () => {
      const token = generateToken({ username: 'bob@builder.com' })
      expect(jwt.verify(token, 'abcdedfgh')).toEqual({
        username: 'bob@builder.com',
        exp: expect.any(Number),
        iat: expect.any(Number)
      })
    })
  })
})
