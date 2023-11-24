const { getPostcodeAddresses } = require('../../../app/api/os-places')
const wreck = require('@hapi/wreck')
jest.mock('@hapi/wreck')

const validAddresses = {
  payload: {
    results: [
      {
        DPA: {
          BUILDING_NUMBER: 1,
          THOROUGHFARE_NAME: 'Main Street',
          POST_TOWN: 'Testington'
        }
      }
    ]
  }
}

describe('OS Places test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getPostcodeAddresses calls with postcode', async () => {
    wreck.get.mockResolvedValue(validAddresses)
    const postcode = 'AB11 2AB'
    const res = await getPostcodeAddresses(postcode)
    expect(wreck.get).toHaveBeenCalledWith(expect.stringMatching(/\/postcode\?postcode=AB11 2AB$/), expect.anything())
    expect(res).not.toBe(null)
    expect(res.length).toBe(1)
    expect(res[0].addressLine1).toBe('1 Main Street')
    expect(res[0].addressTown).toBe('Testington')
    expect(res[0].addressPostcode).toBe('AB11 2AB')
  })
})
