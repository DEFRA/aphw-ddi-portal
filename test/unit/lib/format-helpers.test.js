const { mapOsCountryCodeToCountry, formatAddress, formatAddressSingleLine, formatDogRadioAsHtml, containsPossibleInjectedCode } = require('../../../app/lib/format-helpers')

describe('format-helpers', () => {
  describe('formatAddress', () => {
    const address = {
      addressLine1: '1 Anywhere St',
      addressLine2: 'Any Estate',
      town: 'Chippenham',
      postcode: 'SN15 4JH',
      country: 'England'
    }

    const addressWithoutLine2 = {
      addressLine1: '1 Anywhere St',
      addressLine2: '',
      town: 'Chippenham',
      postcode: 'SN15 4JH',
      country: 'England'
    }

    const addressIncorrectFieldOrder = {
      addressLine2: 'Any Estate',
      addressLine1: '1 Anywhere St',
      postcode: 'SN15 4JH',
      country: 'England',
      town: 'Chippenham'
    }

    const expectedWithCountry = ['1 Anywhere St', 'Any Estate', 'Chippenham', 'SN15 4JH', 'England']
    const expectedWithoutCountryAndAddressLine2 = ['1 Anywhere St', 'Chippenham', 'SN15 4JH', 'England']
    const expectedWithoutCountry = ['1 Anywhere St', 'Any Estate', 'Chippenham', 'SN15 4JH']

    test('should include country by default', () => {
      const formattedAddress = formatAddress(address)
      expect(formattedAddress).toEqual(expectedWithCountry)
    })

    test('should include country given hideCountry set to false', () => {
      const formattedAddress = formatAddress(address, false)
      expect(formattedAddress).toEqual(expectedWithCountry)
    })

    test('should not include country given hideCountry set to true', () => {
      const formattedAddress = formatAddress(address, true)
      expect(formattedAddress).toEqual(expectedWithoutCountry)
    })

    test('should not include address line 2 given hideCountry set to true', () => {
      const formattedAddress = formatAddress(addressWithoutLine2)
      expect(formattedAddress).toEqual(expectedWithoutCountryAndAddressLine2)
    })

    test('should not include country given hideCountry set to false and property order is incorrect', () => {
      const formattedAddress = formatAddress(addressIncorrectFieldOrder, false)
      expect(formattedAddress).toEqual(expectedWithCountry)
    })

    test('should not include country given hideCountry set to true and property order is incorrect', () => {
      const formattedAddress = formatAddress(addressIncorrectFieldOrder, true)
      expect(formattedAddress).toEqual(expectedWithoutCountry)
    })

    test('should return null if no address is found', () => {
      const formattedAddress = formatAddress(undefined)
      expect(formattedAddress).toEqual(null)
    })
  })

  describe('formatAddressJoinTownPostcode', () => {
    const address = {
      addressLine1: '5 Station Road',
      addressLine2: 'Woofferton',
      town: 'Ludlow',
      postcode: 'SY8 4NL',
      country: 'England'
    }

    const addressWithoutLine2 = {
      addressLine1: '5 Station Road',
      addressLine2: '',
      town: 'Ludlow',
      postcode: 'SY8 4NL',
      country: 'England'
    }

    const addressIncorrectFieldOrder = {
      addressLine2: 'Isle of Dogs',
      addressLine1: '23 Billson Street',
      postcode: 'E14 3DA',
      country: 'England',
      town: 'London'
    }

    test('should turn address into a single line without country', () => {
      const formattedAddress = formatAddressSingleLine(address)
      expect(formattedAddress).toBe('5 Station Road, Woofferton, Ludlow, SY8 4NL')
    })

    test('should turn address into a single line without country and strip empty fields', () => {
      const formattedAddress = formatAddressSingleLine(addressWithoutLine2)
      expect(formattedAddress).toBe('5 Station Road, Ludlow, SY8 4NL')
    })

    test('should turn address into a single line without country and order correctly', () => {
      const formattedAddress = formatAddressSingleLine(addressIncorrectFieldOrder, false)
      expect(formattedAddress).toBe('23 Billson Street, Isle of Dogs, London, E14 3DA')
    })

    test('should return null given no address', () => {
      const formattedAddress = formatAddressSingleLine(undefined)
      expect(formattedAddress).toBe(null)
    })
  })

  describe('mapCountry', () => {
    test('should map E to England', () => {
      expect(mapOsCountryCodeToCountry('E')).toBe('England')
    })
    test('should map S to Scotland', () => {
      expect(mapOsCountryCodeToCountry('S')).toBe('Scotland')
    })
    test('should map W to Wales', () => {
      expect(mapOsCountryCodeToCountry('W')).toBe('Wales')
    })
    test('should map undefined to undefined', () => {
      expect(mapOsCountryCodeToCountry(undefined)).toBe(undefined)
    })
    test('should map null to undefined', () => {
      expect(mapOsCountryCodeToCountry(null)).toBe(undefined)
    })
  })

  describe('formatDogRadioAsHtml', () => {
    test('should map a dog', () => {
      const dog = {
        name: 'Fido',
        breed: 'Breed 1',
        dogId: 1,
        indexNumber: 'ED123',
        microchipNumber: '12345'
      }
      const res = formatDogRadioAsHtml(dog)
      expect(res).toBe('Fido<div class="govuk-hint defra-radio-text-block">Breed: Breed 1</div><div class="govuk-hint defra-radio-text-block">Index number: ED123</div><div class="govuk-hint defra-radio-text-block">Microchip number: 12345</div>')
    })
    test('should map a dog with no microchip', () => {
      const dog = {
        name: 'Fido',
        breed: 'Breed 1',
        dogId: 1,
        indexNumber: 'ED123'
      }
      const res = formatDogRadioAsHtml(dog)
      expect(res).toBe('Fido<div class="govuk-hint defra-radio-text-block">Breed: Breed 1</div><div class="govuk-hint defra-radio-text-block">Index number: ED123</div>')
    })

    test('should map a dog with no microchip and no name', () => {
      const dog = {
        breed: 'Breed 1',
        dogId: 1,
        indexNumber: 'ED123'
      }
      const res = formatDogRadioAsHtml(dog)
      expect(res).toBe('<div class="govuk-hint defra-radio-text-block">Breed: Breed 1</div><div class="govuk-hint defra-radio-text-block">Index number: ED123</div>')
    })

    test('should detect injection', () => {
      const dog = {
        name: 'Fido',
        breed: 'Breed> 1',
        dogId: 1,
        indexNumber: 'ED123',
        microchipNumber: '12345'
      }
      const res = formatDogRadioAsHtml(dog)
      expect(res).toBe('Possible injected code')
    })
  })

  describe('containsPossibleInjectedCode', () => {
    test('should detect possible injection', () => {
      const dogHtml = 'name: \'Fido>\', breed: \'Breed 1\', indexNumber: \'ED123\', microchipNumber: \'12345\''
      const res = containsPossibleInjectedCode(dogHtml)
      expect(res).toBeTruthy()
    })
    test('should detect possible injection 2', () => {
      const dogHtml = 'name: \'Fido\', breed: \'Breed 1\', indexNumber: \'E<D123\', microchipNumber: \'12345\''
      const res = containsPossibleInjectedCode(dogHtml)
      expect(res).toBeTruthy()
    })

    test('should pass', () => {
      const dogHtml = 'name: \'Fido\', breed: \'Breed 1\', indexNumber: \'ED123\', microchipNumber: \'12345\''
      const res = containsPossibleInjectedCode(dogHtml)
      expect(res).toBeFalsy()
    })
  })
})
