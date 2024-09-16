const Boom = require('@hapi/boom')
const { getPoliceForce, matchPoliceForceByName } = require('../../../app/api/police-area')

const { getPoliceForces } = require('../../../app/api/ddi-index-api/police-forces')
jest.mock('../../../app/api/ddi-index-api/police-forces')

const wreck = require('@hapi/wreck')
const { user } = require('../../mocks/auth')
jest.mock('@hapi/wreck')

const policeForces = [
  { id: 1, name: 'North Yorkshire Constabulary' },
  { id: 2, name: 'Durham Police' },
  { id: 3, name: 'Avon and Somerset Police' },
  { id: 4, name: 'Berkshire Constabulary' }
]

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

  test('matchPoliceForceByName matches correctly 1', async () => {
    getPoliceForces.mockResolvedValue(policeForces)
    const res = await matchPoliceForceByName('avon-and-somerset', user)
    expect(res).not.toBe(null)
    expect(res.id).toBe(3)
  })

  test('matchPoliceForceByName matches correctly 2', async () => {
    getPoliceForces.mockResolvedValue(policeForces)
    const res = await matchPoliceForceByName('durham', user)
    expect(res).not.toBe(null)
    expect(res.id).toBe(2)
  })

  test('matchPoliceForceByName returns null when no name', async () => {
    getPoliceForces.mockResolvedValue(policeForces)
    const res = await matchPoliceForceByName(null, user)
    expect(res).toBe(null)
  })
})
