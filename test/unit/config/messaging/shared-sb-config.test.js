describe('shared sb config', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  test('should fail validation if invalid', () => {
    process.env.MESSAGE_QUEUE_HOST = ''
    expect(() => require('../../../../app/config/messaging/shared-sb-config.js')).toThrow('The service bus config is invalid. "host" is not allowed to be empty')
  })
})
