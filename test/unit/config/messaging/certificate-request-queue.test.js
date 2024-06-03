describe('certificate-request-queue config', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  test('should fail validation if invalid', () => {
    process.env.CERTIFICATE_REQUEST_QUEUE = ''
    expect(() => require('../../../../app/config/messaging/certificate-request-queue.js')).toThrow('The import queue config is invalid. "address" is not allowed to be empty')
  })
})
