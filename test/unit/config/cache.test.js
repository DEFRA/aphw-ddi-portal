const { PRODUCTION, DEVELOPMENT } = require('../../../app/constants/environments')
describe('main config', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  jest.mock('@hapi/catbox-redis')

  test('should not use redis when host is unset', () => {
    process.env.NODE_ENV = DEVELOPMENT
    process.env.REDIS_HOST = undefined
    const value = require('../../../app/config/cache')
    expect(value.catboxOptions).toEqual({ })
  })

  test('should use redis when host is set and in dev', () => {
    process.env.NODE_ENV = DEVELOPMENT
    process.env.REDIS_HOST = 'redis.host'
    const value = require('../../../app/config/cache')
    expect(value.catboxOptions.host).toBe('redis.host')
  })

  test('should not use redis when host is unset', () => {
    process.env.NODE_ENV = DEVELOPMENT
    process.env.REDIS_HOST = undefined
    const value = require('../../../app/config/cache')
    expect(value.catboxOptions).toEqual({ })
  })

  test('should use redis in production', () => {
    process.env.NODE_ENV = PRODUCTION
    process.env.REDIS_HOST = 'redis.host'
    const value = require('../../../app/config/cache')
    expect(value.catboxOptions.host).toBe('redis.host')
  })

  test('should fail validation if invalid', () => {
    process.env.REDIS_TTL = { }
    expect(() => require('../../../app/config/cache')).toThrow('The cache config is invalid. "ttl" must be a number')
  })
})
