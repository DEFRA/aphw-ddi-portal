describe('auth config', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  test('should fail validation if invalid', () => {
    process.env.REDIRECT_URL = 'https://redirect.com'
    process.env.AUTHENTICATION_ENABLED = 'invalid'
    expect(() => require('../../../app/config/index')).toThrow('The auth config is invalid. "enabled" must be a boolean')
  })
})
