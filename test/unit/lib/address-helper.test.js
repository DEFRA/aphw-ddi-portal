const { shuffleAddress, shuffleFieldDataIfNeeded } = require('../../../app/lib/address-helper')

describe('shuffleAddress test', () => {
  test('should build address with all parts', () => {
    expect(shuffleAddress({
      ddi_address_line_1: 'addr1',
      ddi_address_line_2: 'addr2',
      ddi_town: 'town',
      ddi_postcode: 'postcode'
    })).toEqual({
      ddi_address_line_1: 'addr1',
      ddi_address_line_2: 'addr2',
      ddi_town: 'town',
      ddi_postcode: 'postcode'
    })
  })
  test('should build address when missing 1 line', () => {
    expect(shuffleAddress({
      ddi_address_line_1: 'addr1',
      ddi_address_line_2: '',
      ddi_town: 'town',
      ddi_postcode: 'postcode'
    })).toEqual({
      ddi_address_line_1: 'addr1',
      ddi_address_line_2: 'town',
      ddi_town: 'postcode',
      ddi_postcode: ''
    })
  })
  test('should build address when missing 2 lines', () => {
    expect(shuffleAddress({
      ddi_address_line_1: 'addr1',
      ddi_address_line_2: '',
      ddi_town: '',
      ddi_postcode: 'postcode'
    })).toEqual({
      ddi_address_line_1: 'addr1',
      ddi_address_line_2: 'postcode',
      ddi_town: '',
      ddi_postcode: ''
    })
  })
  test('should build address when all lines are null', () => {
    expect(shuffleAddress({
      ddi_address_line_1: null,
      ddi_address_line_2: null,
      ddi_town: null,
      ddi_postcode: null
    })).toEqual({
      ddi_address_line_1: '',
      ddi_address_line_2: '',
      ddi_town: '',
      ddi_postcode: ''
    })
  })
})

describe('shuffleFieldDataIfNeeded test', () => {
  test('should not shuffle address', () => {
    expect(shuffleFieldDataIfNeeded({
      ddi_index_number: 'ED12345',
      ddi_address_line_1: 'addr1',
      ddi_address_line_2: 'addr2',
      ddi_town: 'town',
      ddi_postcode: 'postcode'
    })).toEqual({
      ddi_index_number: 'ED12345',
      ddi_address_line_1: 'addr1',
      ddi_address_line_2: 'addr2',
      ddi_town: 'town',
      ddi_postcode: 'postcode'
    })
  })
  test('should shuffle address', () => {
    expect(shuffleFieldDataIfNeeded({
      ddi_index_number: 'ED12345',
      ddi_address_line_1: 'addr1',
      ddi_address_line_2: '',
      ddi_town: null,
      ddi_postcode: 'postcode'
    })).toEqual({
      ddi_index_number: 'ED12345',
      ddi_address_line_1: 'addr1',
      ddi_address_line_2: 'postcode',
      ddi_town: '',
      ddi_postcode: ''
    })
  })
})
