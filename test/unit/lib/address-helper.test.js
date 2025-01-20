const { preparePostalNameAndAddress } = require('../../../app/lib/address-helper')

describe('preparePostalNameAndAddress test', () => {
  test('should build address with all parts', () => {
    expect(preparePostalNameAndAddress({
      ddi_owner_name: 'John Smith',
      ddi_address_line_1: 'addr1',
      ddi_address_line_2: 'addr2',
      ddi_town: 'town',
      ddi_postcode: 'postcode'
    })).toEqual('John Smith\naddr1\naddr2\ntown\npostcode')
  })
  test('should build address when missing 1 line', () => {
    expect(preparePostalNameAndAddress({
      ddi_owner_name: 'John Smith',
      ddi_address_line_1: 'addr1',
      ddi_address_line_2: '',
      ddi_town: 'town',
      ddi_postcode: 'postcode'
    })).toEqual('John Smith\naddr1\ntown\npostcode')
  })
  test('should build address when missing 2 lines', () => {
    expect(preparePostalNameAndAddress({
      ddi_owner_name: 'John Smith',
      ddi_address_line_1: 'addr1',
      ddi_address_line_2: '',
      ddi_town: '',
      ddi_postcode: 'postcode'
    })).toEqual('John Smith\naddr1\npostcode')
  })
  test('should build address when all lines are null', () => {
    expect(preparePostalNameAndAddress({
      ddi_owner_name: 'John Smith',
      ddi_address_line_1: null,
      ddi_address_line_2: null,
      ddi_town: null,
      ddi_postcode: null
    })).toEqual('John Smith')
  })
})
