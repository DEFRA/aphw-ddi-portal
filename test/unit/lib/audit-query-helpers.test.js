const { getFieldHint, getFieldLabel, mapEventType, mapEventLinkType, getNumberFoundText, getExtraColumnFunctions, eitherDateIsPopulated, getExtraColumnNames, displaySearchCriteria } = require('../../../app/lib/audit-query-helpers')

describe('audit query helpers', () => {
  describe('getFieldHint', () => {
    test('handles all options', () => {
      expect(getFieldHint('dog')).toBe('For example ED012345')
      expect(getFieldHint('search')).toBe('Enter one or more search terms separated by commas')
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
      expect(mapEventType('uk.gov.defra.ddi.event.external.view.dog.download')).toBe('Download dog record')
      expect(mapEventType('uk.gov.defra.ddi.event.external.view.owner')).toBe('View owner')
      expect(mapEventType('uk.gov.defra.ddi.event.external.view.owner.activity')).toBe('Check activity on owner')
      expect(mapEventType('uk.gov.defra.ddi.event.external.xxx')).toBe('Unknown')
    })
  })

  describe('mapEventLinkType', () => {
    test('handles all options', () => {
      expect(mapEventLinkType('uk.gov.defra.ddi.event.external.search')).toBe('Other')
      expect(mapEventLinkType('uk.gov.defra.ddi.event.external.view.dog')).toBe('dog-details')
      expect(mapEventLinkType('uk.gov.defra.ddi.event.external.view.dog.activity')).toBe('dog-details')
      expect(mapEventLinkType('uk.gov.defra.ddi.event.external.view.owner')).toBe('owner-details')
      expect(mapEventLinkType('uk.gov.defra.ddi.event.external.view.owner.activity')).toBe('owner-details')
      expect(mapEventLinkType('uk.gov.defra.ddi.event.external.xxx')).toBe('Other')
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
      expect(func[0](row)).toEqual({ text: 'Search' })
      expect(func[1](row)).toEqual({ text: 'term1' })
    })

    test('handles user alternative value', () => {
      const func = getExtraColumnFunctions('user')
      const row = { type: 'uk.gov.defra.ddi.event.external.view.dog', details: { pk: 'ED123' } }
      expect(func[0](row)).toEqual({ text: 'View dog' })
      expect(func[1](row)).toEqual({ linkPk: 'ED123', linkType: 'dog-details' })
    })

    test('handles search', () => {
      const func = getExtraColumnFunctions('search')
      const row = { type: 'uk.gov.defra.ddi.event.external.search', details: { searchTerms: 'term1' }, username: 'testuser@here.com' }
      expect(func[0](row)).toEqual({ text: 'term1' })
      expect(func[1](row)).toEqual({ text: 'testuser@here.com' })
    })

    test('handles date', () => {
      const func = getExtraColumnFunctions('date')
      const row = { type: 'uk.gov.defra.ddi.event.external.search', details: { searchTerms: 'term1' }, username: 'testuser@here.com' }
      expect(func[0](row)).toEqual({ text: 'Search' })
      expect(func[1](row)).toEqual({ text: 'term1' })
      expect(func[2](row)).toEqual({ text: 'testuser@here.com' })
    })

    test('handles date alternative value', () => {
      const func = getExtraColumnFunctions('date')
      const row = { type: 'uk.gov.defra.ddi.event.external.view.dog', details: { pk: 'ED123' } }
      expect(func[0](row)).toEqual({ text: 'View dog' })
      expect(func[1](row)).toEqual({ linkPk: 'ED123', linkType: 'dog-details' })
    })

    test('handles login', () => {
      const func = getExtraColumnFunctions('login')
      const row = { type: 'uk.gov.defra.ddi.event.external.login', details: { userAgent: 'chrome' }, username: 'testuser@here.com' }
      expect(func[0](row)).toEqual({ text: 'chrome' })
      expect(func[1](row)).toEqual({ text: 'testuser@here.com' })
    })

    test('handles dog', () => {
      const func = getExtraColumnFunctions('dog')
      const row = { type: 'uk.gov.defra.ddi.event.external.view.dog', username: 'testuser@here.com' }
      expect(func[0](row)).toEqual({ text: 'View dog' })
      expect(func[1](row)).toEqual({ text: 'testuser@here.com' })
    })

    test('handles owner', () => {
      const func = getExtraColumnFunctions('owner')
      const row = { type: 'uk.gov.defra.ddi.event.external.view.owner', username: 'testuser@here.com' }
      expect(func[0](row)).toEqual({ text: 'View owner' })
      expect(func[1](row)).toEqual({ text: 'testuser@here.com' })
    })

    test('handles invalid type', () => {
      const func = getExtraColumnFunctions('invalid')
      const row = {}
      expect(func[0](row)).toEqual({ text: 'unknown' })
      expect(func[1](row)).toEqual({ text: 'unknown' })
      expect(func[2](row)).toEqual({ text: 'unknown' })
    })

    test('eitherDateIsPopulated', () => {
      expect(eitherDateIsPopulated()).toBeFalsy()
      expect(eitherDateIsPopulated({})).toBeFalsy()
      expect(eitherDateIsPopulated({ fromDate: null, toDate: null })).toBeFalsy()
      expect(eitherDateIsPopulated({ fromDate: undefined, toDate: undefined })).toBeFalsy()
      expect(eitherDateIsPopulated({ fromDate: new Date(2024, 1, 1), toDate: undefined })).toBeTruthy()
      expect(eitherDateIsPopulated({ fromDate: null, toDate: new Date(2024, 2, 2) })).toBeTruthy()
      expect(eitherDateIsPopulated({ fromDate: new Date(2024, 1, 1), toDate: new Date(2024, 2, 2) })).toBeTruthy()
    })

    test('getExtraColumnNames', () => {
      expect(getExtraColumnNames('user')).toEqual(['Action', 'Key'])
      expect(getExtraColumnNames('search')).toEqual(['Search terms', 'Username'])
      expect(getExtraColumnNames('dog')).toEqual(['Action', 'Username'])
      expect(getExtraColumnNames('owner')).toEqual(['Action', 'Username'])
      expect(getExtraColumnNames('login')).toEqual(['Operating system and browser', 'Username'])
      expect(getExtraColumnNames('date')).toEqual(['Action', 'Key', 'Username'])
    })
  })

  describe('displaySearchCriteria', () => {
    test('handles no details', () => {
      expect(displaySearchCriteria(null)).toBe('')
    })

    test('handles search term only', () => {
      expect(displaySearchCriteria({ details: { searchTerms: 'term1 term2' } })).toBe('term1 term2')
    })

    test('handles search term and fuzzy true', () => {
      expect(displaySearchCriteria({ details: { searchTerms: 'term1 term2', fuzzy: true } })).toBe('term1 term2 (fuzzy)')
    })

    test('handles search term and fuzzy false', () => {
      expect(displaySearchCriteria({ details: { searchTerms: 'term1 term2', fuzzy: false } })).toBe('term1 term2')
    })

    test('handles search term and national true', () => {
      expect(displaySearchCriteria({ details: { searchTerms: 'term1 term2', national: true } })).toBe('term1 term2 (national)')
    })

    test('handles search term and national false', () => {
      expect(displaySearchCriteria({ details: { searchTerms: 'term1 term2', national: false } })).toBe('term1 term2 (local)')
    })

    test('handles search term and fuzzy and national', () => {
      expect(displaySearchCriteria({ details: { searchTerms: 'term1 term2', fuzzy: true, national: true } })).toBe('term1 term2 (fuzzy, national)')
    })
  })
})
