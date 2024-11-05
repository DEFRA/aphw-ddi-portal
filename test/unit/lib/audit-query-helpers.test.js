const { getFieldHint, getFieldLabel, mapEventType, getNumberFoundText, getExtraColumnFunctions } = require('../../../app/lib/audit-query-helpers')

describe('audit query helpers', () => {
  describe('getFieldHint', () => {
    test('handles all options', () => {
      expect(getFieldHint('dog')).toBe('For example ED012345')
      expect(getFieldHint('search')).toBe('Enter one or more search terms separated by spaces')
      expect(getFieldHint('owner')).toBe('For example P-1234-5678. This can be found within the URL of a \'view owner details\' page')
      expect(getFieldHint('user')).toBe('The username is the user\'s email address')
      expect(getFieldHint('date')).toBe('')
    })
  })

  describe('getFieldLabel', () => {
    test('handles all options', () => {
      expect(getFieldLabel('user')).toBe('Username')
      expect(getFieldLabel('search')).toBe('Search term(s)')
      expect(getFieldLabel('owner')).toBe('Owner reference')
      expect(getFieldLabel('dog')).toBe('Dog index number')
      expect(getFieldLabel('date')).toBe('')
    })
  })

  describe('mapEventType', () => {
    test('handles all options', () => {
      expect(mapEventType('uk.gov.defra.ddi.event.external.search')).toBe('Search')
      expect(mapEventType('uk.gov.defra.ddi.event.external.view.dog')).toBe('View dog')
      expect(mapEventType('uk.gov.defra.ddi.event.external.view.dog.activity')).toBe('Check activity on dog')
      expect(mapEventType('uk.gov.defra.ddi.event.external.view.owner')).toBe('View owner')
      expect(mapEventType('uk.gov.defra.ddi.event.external.view.owner.activity')).toBe('Check activity on owner')
      expect(mapEventType('uk.gov.defra.ddi.event.external.xxx')).toBe('Unknown')
    })
  })

  describe('getNumberFoundText', () => {
    test('handles all options', () => {
      expect(getNumberFoundText(null)).toBe('No records found')
      expect(getNumberFoundText([])).toBe('No records found')
      expect(getNumberFoundText([{ id: 1 }])).toBe('1 record found')
      expect(getNumberFoundText([{ id: 1 }, { id: 2 }])).toBe('2 records found')
      expect(getNumberFoundText([{ id: 1 }, { id: 2 }, { id: 3 }])).toBe('3 records found')
    })
  })

  describe('getExtraColumnFunctions', () => {
    test('handles user', () => {
      const func = getExtraColumnFunctions('user')
      const row = { type: 'uk.gov.defra.ddi.event.external.search', details: { searchTerms: 'term1' } }
      expect(func(row)).toBe(['Search', 'term1'])
    })
  })
})
