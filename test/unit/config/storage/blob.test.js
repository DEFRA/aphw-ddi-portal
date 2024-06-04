describe('blob config', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  test('should fail validation if invalid', () => {
    process.env.AZURE_STORAGE_CONNECTION_STRING = undefined
    process.env.AZURE_STORAGE_USE_CONNECTION_STRING = 'true'
    expect(() => require('../../../../app/config/storage/blob')).toThrow('The blob storage config is invalid. "connectionString" is required')
  })
})
