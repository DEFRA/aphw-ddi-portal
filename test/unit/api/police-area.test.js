const Boom = require('@hapi/boom')
const { getPoliceForce } = require('../../../app/api/police-area')

const wreck = require('@hapi/wreck')
jest.mock('@hapi/wreck')

describe('PoliceArea test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getPoliceForce calls with coords', async () => {
    wreck.get.mockResolvedValue({ payload: { force: 'test-force' } })
    const coords = { lat: 123, lng: 456 }
    const res = await getPoliceForce(coords)
    expect(wreck.get).toHaveBeenCalledWith(expect.stringMatching(/\/locate-neighbourhood\?q=123,456$/), expect.anything())
    expect(res).not.toBe(null)
    expect(res).toBe('test-force')
  })

  test('getPoliceForce returns null if error thrown', async () => {
    wreck.get.mockImplementation(() => {
      throw new Error('Police force not found')
    })
    const coords = { lat: 123, lng: 456 }
    const res = await getPoliceForce(coords)
    expect(res).toBe(null)
  })

  test('getPoliceForce handles retries if rate limited', async () => {
    wreck.get.mockImplementation(() => {
      throw new Boom.Boom('API rate limiting', { statusCode: 429 })
    })
    const coords = { lat: 123, lng: 456 }
    const res = await getPoliceForce(coords)
    expect(res).toBe(null)
    expect(wreck.get).toHaveBeenCalledTimes(3)
  })
})
