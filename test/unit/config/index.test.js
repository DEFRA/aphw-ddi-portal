describe('main config', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  test('should fail validation if invalid', () => {
    process.env.NODE_ENV = 'production'
    process.env.COOKIE_PASSWORD = 'invalid-password'
    expect(() => require('../../../app/config/index')).toThrow('The server config is invalid. "cookie.password" length must be at least 32 characters long')
  })
})
