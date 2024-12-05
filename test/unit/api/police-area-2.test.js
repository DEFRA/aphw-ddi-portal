const { user } = require('../../mocks/auth')

const wreck = require('@hapi/wreck')
jest.mock('@hapi/wreck')

jest.mock('../../../app/api/os-places')
const { getPostcodeLongLat } = require('../../../app/api/os-places')

jest.mock('../../../app/api/ddi-index-api/police-forces')
const { getPoliceForceByApiCode } = require('../../../app/api/ddi-index-api/police-forces')

const { lookupPoliceForceByPostcode } = require('../../../app/api/police-area')

describe('PoliceArea2 test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('lookupPoliceForceByPostcode returns force', async () => {
    wreck.get.mockResolvedValue({ payload: { force: 'test-force' } })
    getPoliceForceByApiCode.mockResolvedValue({ id: 5, name: 'Test Force' })
    const coords = { lat: 123, lng: 456 }
    const postcode = 'TS1 1TS'
    getPostcodeLongLat.mockResolvedValue(coords)
    const res = await lookupPoliceForceByPostcode(postcode, user)
    expect(wreck.get).toHaveBeenCalledWith(expect.stringMatching(/\/locate-neighbourhood\?q=123,456$/), expect.anything())
    expect(res).not.toBe(null)
    expect(res).toEqual({ id: 5, name: 'Test Force' })
  })
})
