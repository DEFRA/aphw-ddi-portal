const Boom = require('@hapi/boom')
const { getPoliceForce } = require('../../../app/api/police-area')

const wreck = require('@hapi/wreck')
const { user } = require('../../mocks/auth')
jest.mock('@hapi/wreck')

const { getPoliceForceByShortName } = require('../../../app/api/ddi-index-api/police-forces')

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

  test('getPoliceForceByShortName calls correctly', async () => {
    wreck.get.mockResolvedValue({ payload: { policeForce: { id: 123, name: 'Test Force' } } })
    const res = await getPoliceForceByShortName('avon-and-somerset', user)
    expect(res).toEqual({ id: 123, name: 'Test Force' })
    expect(wreck.get).toHaveBeenCalledWith('http://test.com/police-force-by-short-name/avon-and-somerset', expect.anything())
  })
})
