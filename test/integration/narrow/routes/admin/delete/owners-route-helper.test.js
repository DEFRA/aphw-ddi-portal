const { getCheckboxSortQueryString, handleCheckboxSort } = require('../../../../../../app/routes/admin/delete/owners-route-helper')

describe('Delete dogs helper', () => {
  afterEach(async () => {
    jest.clearAllMocks()
  })

  const ownerRows = [
    { personReference: 'P-222' },
    { personReference: 'P-111' },
    { personReference: 'P-555' },
    { personReference: 'P-444' },
    { personReference: 'P-333' }
  ]

  const ownerSelections = ['P-111', 'P-222', 'P-333']

  describe('getCheckboxSortQueryString', () => {
    test('defaults sort order', () => {
      const res = getCheckboxSortQueryString({ query: { } })

      expect(res).toBe('?sortKey=selected&sortOrder=ASC')
    })

    test('toggles sort order to DESC', () => {
      const res = getCheckboxSortQueryString({ query: { sortKey: 'selected', sortOrder: 'ASC' } })

      expect(res).toBe('?sortKey=selected&sortOrder=DESC')
    })

    test('toggles sort order to ASC', () => {
      const res = getCheckboxSortQueryString({ query: { sortKey: 'selected', sortOrder: 'DESC' } })

      expect(res).toBe('?sortKey=selected&sortOrder=ASC')
    })

    test('toggles sort order to ASC for owner', () => {
      const res = getCheckboxSortQueryString({ query: { sortKey: 'owner', sortOrder: 'DESC' } })

      expect(res).toBe('?sortKey=owner&sortOrder=ASC')
    })
  })

  describe('handleCheckboxSort', () => {
    test('returns no change', () => {
      const res = handleCheckboxSort({ query: { sortKey: 'something else' } }, ownerRows, ownerSelections)

      expect(res).toEqual(ownerRows)
    })

    test('sorts to DESC', () => {
      const res = handleCheckboxSort({ query: { sortKey: 'selected' } }, ownerRows, ownerSelections)

      expect(res.length).toBe(5)
      expect(res[0].personReference).toBe('P-555')
      expect(res[1].personReference).toBe('P-444')
      expect(res[2].personReference).toBe('P-222')
      expect(res[3].personReference).toBe('P-111')
      expect(res[4].personReference).toBe('P-333')
    })

    test('sorts to DESC when specified', () => {
      const res = handleCheckboxSort({ query: { sortKey: 'selected', sortOrder: 'DESC' } }, ownerRows, ownerSelections)

      expect(res.length).toBe(5)
      expect(res[0].personReference).toBe('P-555')
      expect(res[1].personReference).toBe('P-444')
      expect(res[2].personReference).toBe('P-222')
      expect(res[3].personReference).toBe('P-111')
      expect(res[4].personReference).toBe('P-333')
    })

    test('sorts to ASC when specified', () => {
      const res = handleCheckboxSort({ query: { sortKey: 'selected', sortOrder: 'ASC' } }, ownerRows, ownerSelections)

      expect(res.length).toBe(5)
      expect(res[0].personReference).toBe('P-222')
      expect(res[1].personReference).toBe('P-111')
      expect(res[2].personReference).toBe('P-333')
      expect(res[3].personReference).toBe('P-555')
      expect(res[4].personReference).toBe('P-444')
    })
  })
})
