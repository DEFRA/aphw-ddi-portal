const { getPostcodeAddresses, getPostcodeLongLat } = require('../../../app/api/os-places')
const wreck = require('@hapi/wreck')
jest.mock('@hapi/wreck')

const validAddresses = {
  payload: {
    results: [
      {
        DPA: {
          BUILDING_NUMBER: 1,
          THOROUGHFARE_NAME: 'MAIN STREET',
          POST_TOWN: 'TESTINGTON',
          POSTCODE: 'AB11 2AB'
        }
      }
    ]
  }
}

const validAddressesWithFlat = {
  payload: {
    results: [
      {
        DPA: {
          SUB_BUILDING_NAME: 'FLAT 2',
          BUILDING_NUMBER: 1,
          THOROUGHFARE_NAME: 'MAIN STREET',
          POST_TOWN: 'TESTINGTON',
          POSTCODE: 'AB11 2AB'
        }
      }
    ]
  }
}

const validAddressesWithFlatsForSorting = {
  payload: {
    results: [
      {
        DPA: {
          SUB_BUILDING_NAME: 'FLAT 3',
          BUILDING_NUMBER: 1,
          THOROUGHFARE_NAME: 'MAIN STREET',
          POST_TOWN: 'TESTINGTON',
          POSTCODE: 'AB11 2AB'
        }
      },
      {
        DPA: {
          SUB_BUILDING_NAME: 'FLAT 4',
          BUILDING_NUMBER: 1,
          THOROUGHFARE_NAME: 'MAIN STREET',
          POST_TOWN: 'TESTINGTON',
          POSTCODE: 'AB11 2AB'
        }
      },
      {
        DPA: {
          SUB_BUILDING_NAME: 'FLAT 2',
          BUILDING_NUMBER: 1,
          THOROUGHFARE_NAME: 'MAIN STREET',
          POST_TOWN: 'TESTINGTON',
          POSTCODE: 'AB11 2AB'
        }
      },
      {
        DPA: {
          SUB_BUILDING_NAME: 'FLAT 1',
          BUILDING_NUMBER: 1,
          THOROUGHFARE_NAME: 'MAIN STREET',
          POST_TOWN: 'TESTINGTON',
          POSTCODE: 'AB11 2AB'
        }
      }
    ]
  }
}

const validAddressWithLatLng = {
  payload: {
    results: [
      {
        DPA: {
          BUILDING_NUMBER: 1,
          THOROUGHFARE_NAME: 'MAIN STREET',
          POST_TOWN: 'TESTINGTON',
          POSTCODE: 'AB11 2AB',
          LAT: 123,
          LNG: 456
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
    expect(res[0].addressLine1).toBe('1 MAIN STREET')
    expect(res[0].addressTown).toBe('TESTINGTON')
    expect(res[0].addressPostcode).toBe(postcode)
  })

  test('getPostcodeAddresses calls with postcode and houseNumber', async () => {
    wreck.get.mockResolvedValue(validAddressesWithFlat)
    const postcode = 'AB11 2AB'
    const res = await getPostcodeAddresses(postcode, 'FLAT 2')
    expect(wreck.get).toHaveBeenCalledWith(expect.stringMatching(/\/postcode\?postcode=AB11 2AB$/), expect.anything())
    expect(res).not.toBe(null)
    expect(res.length).toBe(1)
    expect(res[0].addressLine1).toBe('FLAT 2, 1 MAIN STREET')
    expect(res[0].addressTown).toBe('TESTINGTON')
    expect(res[0].addressPostcode).toBe(postcode)
  })

  test('getPostcodeAddresses returns zero results when no addresses found', async () => {
    wreck.get.mockResolvedValue(validAddressesWithFlat)
    const postcode = 'TT11 2TT'
    const res = await getPostcodeAddresses(postcode, 'xxx')
    expect(res).not.toBe(null)
    expect(res.length).toBe(0)
  })

  test('getPostcodeAddresses sorts flats', async () => {
    wreck.get.mockResolvedValue(validAddressesWithFlatsForSorting)
    const postcode = 'AB11 2AB'
    const res = await getPostcodeAddresses(postcode)
    expect(res).not.toBe(null)
    expect(res.length).toBe(4)
    expect(res[0].addressLine1).toBe('FLAT 1, 1 MAIN STREET')
    expect(res[0].addressTown).toBe('TESTINGTON')
    expect(res[0].addressPostcode).toBe(postcode)
    expect(res[1].addressLine1).toBe('FLAT 2, 1 MAIN STREET')
    expect(res[2].addressLine1).toBe('FLAT 3, 1 MAIN STREET')
    expect(res[3].addressLine1).toBe('FLAT 4, 1 MAIN STREET')
  })

  test('getPostcodeLongLat calls with postcode', async () => {
    wreck.get.mockResolvedValue(validAddressWithLatLng)
    const postcode = 'AB11 2AB'
    const res = await getPostcodeLongLat(postcode)
    expect(wreck.get).toHaveBeenCalledWith(expect.stringMatching(/\/postcode\?postcode=AB11 2AB&output_srs=WGS84$/), expect.anything())
    expect(res).not.toBe(null)
    expect(res.lat).toBe(123)
    expect(res.lng).toBe(456)
  })

  test('getPostcodeLongLat returns null if error thrown', async () => {
    wreck.get.mockImplementation(() => {
      throw new Error('Postcode not found')
    })
    const postcode = 'AB11 2AB'
    const res = await getPostcodeLongLat(postcode)
    expect(res).toBe(null)
  })
})
