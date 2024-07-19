const { getPostcodeAddresses, getPostcodeLongLat, buildAddressResult } = require('../../../app/api/os-places')
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

const validAddressesWithCountry = {
  payload: {
    results: [
      {
        DPA: {
          BUILDING_NUMBER: 1,
          THOROUGHFARE_NAME: 'MAIN STREET',
          POST_TOWN: 'TESTINGTON',
          POSTCODE: 'AB11 2AB',
          COUNTRY_CODE: 'W'
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
          SUB_BUILDING_NAME: 'FLAT 3',
          BUILDING_NUMBER: 1,
          THOROUGHFARE_NAME: 'MAIN STREET',
          POST_TOWN: 'TESTINGTON 2',
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

  describe('getPostcodeAddresses', () => {
    test('getPostcodeAddresses calls with postcode', async () => {
      wreck.get.mockResolvedValue(validAddresses)
      const postcode = 'AB11 2AB'
      const res = await getPostcodeAddresses(postcode)
      expect(wreck.get).toHaveBeenCalledWith(expect.stringMatching(/\/postcode\?postcode=AB11 2AB$/), expect.anything())
      expect(res).not.toBe(null)
      expect(res.length).toBe(1)
      expect(res[0].addressLine1).toBe('1 Main Street')
      expect(res[0].town).toBe('Testington')
      expect(res[0].postcode).toBe(postcode)
    })

    test('getPostcodeAddresses calls with postcode and country code', async () => {
      wreck.get.mockResolvedValue(validAddressesWithCountry)
      const postcode = 'SA36 0DZ'
      const res = await getPostcodeAddresses(postcode)
      expect(res[0].country).toBe('Wales')
    })

    test('getPostcodeAddresses calls with postcode and houseNumber', async () => {
      wreck.get.mockResolvedValue(validAddressesWithFlat)
      const postcode = 'AB11 2AB'
      const res = await getPostcodeAddresses(postcode, 'FLAT 2')
      expect(wreck.get).toHaveBeenCalledWith(expect.stringMatching(/\/postcode\?postcode=AB11 2AB$/), expect.anything())
      expect(res).not.toBe(null)
      expect(res.length).toBe(1)
      expect(res[0].addressLine1).toBe('Flat 2, 1 Main Street')
      expect(res[0].town).toBe('Testington')
      expect(res[0].postcode).toBe(postcode)
    })

    test('getPostcodeAddresses returns zero results when no addresses found', async () => {
      wreck.get.mockResolvedValue(validAddressesWithFlat)
      const postcode = 'TT11 2TT'
      const res = await getPostcodeAddresses(postcode, 'xxx')
      expect(res).not.toBe(null)
      expect(res.length).toBe(0)
    })

    test('getPostcodeAddresses returns zero results when no payload returned from API', async () => {
      wreck.get.mockResolvedValue({ payload: null })
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
      expect(res.length).toBe(5)
      expect(res[0].addressLine1).toBe('Flat 1, 1 Main Street')
      expect(res[0].town).toBe('Testington')
      expect(res[0].postcode).toBe(postcode)
      expect(res[1].addressLine1).toBe('Flat 2, 1 Main Street')
      expect(res[2].addressLine1).toBe('Flat 3, 1 Main Street')
      expect(res[3].addressLine1).toBe('Flat 3, 1 Main Street')
      expect(res[4].addressLine1).toBe('Flat 4, 1 Main Street')
    })

    test('getPostcodeAddresses handles api failure', async () => {
      wreck.get.mockRejectedValue(new Error('error'))
      const res = await getPostcodeAddresses('AB1 1CD')
      expect(res).toEqual([])
    })
  })

  describe('buildAddressResult', () => {
    test('should deal with organisations and building names', () => {
      const result = {
        DPA: {
          ORGANISATION_NAME: 'HELIX RESTAURANT',
          BUILDING_NAME: 'THE GHERKIN',
          BUILDING_NUMBER: 30,
          THOROUGHFARE_NAME: 'ST MARY AVE',
          POST_TOWN: 'LONDON',
          POSTCODE: 'EC3A 8BF'
        }
      }
      const addressResult = buildAddressResult(result)
      expect(addressResult).toEqual({
        addressLine1: '30 The Gherkin, St Mary Ave',
        addressLine2: undefined,
        country: undefined,
        postcode: 'EC3A 8BF',
        sorting: '0000 0000',
        town: 'London'
      })
    })

    test('should deal with organisations', () => {
      const result = {
        DPA: {
          ORGANISATION_NAME: 'HELIX RESTAURANT',
          POST_TOWN: 'LONDON',
          POSTCODE: 'EC3A 8BF'
        }
      }
      const addressResult = buildAddressResult(result)
      expect(addressResult).toEqual({
        addressLine1: 'Helix Restaurant',
        addressLine2: undefined,
        country: undefined,
        postcode: 'EC3A 8BF',
        sorting: '0000 0000',
        town: 'London'
      })
    })
  })

  describe('getPostcodeLongLat', () => {
    test('getPostcodeLongLat calls with postcode', async () => {
      wreck.get.mockResolvedValue(validAddressWithLatLng)
      const postcode = 'AB11 2AB'
      const res = await getPostcodeLongLat(postcode)
      expect(wreck.get).toHaveBeenCalledWith(expect.stringMatching(/\/postcode\?postcode=AB11 2AB&output_srs=WGS84$/), expect.anything())
      expect(res).not.toBe(null)
      expect(res.lat).toBe(123)
      expect(res.lng).toBe(456)
    })

    test('getPostcodeLongLat returns null if no results', async () => {
      wreck.get.mockResolvedValue({
        payload: {
          results: []
        }
      })
      const postcode = 'AB11 2AB'
      const res = await getPostcodeLongLat(postcode)
      expect(res).toBe(null)
    })

    test('getPostcodeLongLat returns null if error thrown', async () => {
      wreck.get.mockResolvedValue(() => {
        throw new Error('Postcode not found')
      })
      const postcode = 'AB11 2AB'
      const res = await getPostcodeLongLat(postcode)
      expect(res).toBe(null)
    })
  })
})
