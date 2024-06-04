const { getCombinedSelectedList, getDateOverrideQueryString, getCheckboxSortQueryString, handleCheckboxSort } = require('../../../../../../app/routes/admin/delete/dogs-route-helper')

jest.mock('../../../../../../app/session/admin/delete-dogs')
const { getDogsForDeletion } = require('../../../../../../app/session/admin/delete-dogs')

describe('Delete dogs helper', () => {
  afterEach(async () => {
    jest.clearAllMocks()
  })

  const dogSelections1 = ['ED0001', 'ED0002', 'ED0003']
  const dogSelections2 = ['ED0004', 'ED0005']

  const dogRows = [
    {
      indexNumber: 'ED0001',
      dateOfBirth: new Date(2020, 1, 3),
      cdoIssued: new Date(2024, 4, 28),
      status: { status: 'Exempt' }
    },
    {
      indexNumber: 'ED0002',
      dateOfBirth: new Date(2021, 2, 4),
      cdoIssued: new Date(2024, 3, 27),
      status: { status: 'Exempt' }
    },
    {
      indexNumber: 'ED0003',
      dateOfBirth: new Date(2022, 5, 8),
      cdoIssued: new Date(2024, 1, 1),
      status: { status: 'Exempt' }
    },
    {
      indexNumber: 'ED0004',
      dateOfBirth: new Date(2021, 1, 3),
      cdoIssued: new Date(2022, 4, 28),
      status: { status: 'Exempt' }
    },
    {
      indexNumber: 'ED0005',
      dateOfBirth: new Date(2021, 5, 4),
      cdoIssued: new Date(2023, 5, 27),
      status: { status: 'Exempt' }
    }
  ]

  describe('getCombinedSelectedList', () => {
    test('concatenates lists', () => {
      getDogsForDeletion
        .mockReturnValueOnce(dogSelections1)
        .mockReturnValueOnce(dogSelections2)

      const res = getCombinedSelectedList({})

      expect(res.length).toBe(5)
      expect(res[0]).toBe('ED0001')
      expect(res[1]).toBe('ED0002')
      expect(res[2]).toBe('ED0003')
      expect(res[3]).toBe('ED0004')
      expect(res[4]).toBe('ED0005')
    })
  })

  describe('getDateOverrideQueryString', () => {
    test('returns correct params', () => {
      const res = getDateOverrideQueryString({ query: { today: '2038-01-01' } })

      expect(res).toBe('?today=2038-01-01')
    })

    test('returns no params', () => {
      const res = getDateOverrideQueryString({ query: { novalue: '123' } })

      expect(res).toBe('')
    })
  })

  describe('getCheckboxSortQueryString', () => {
    test('returns correct param delimiter of ampersand', () => {
      const res = getCheckboxSortQueryString({ query: { today: '2038-01-01' } })

      expect(res).toBe('&sortKey=selected&sortOrder=ASC')
    })

    test('returns correct param delimiter of question mark', () => {
      const res = getCheckboxSortQueryString({ query: { notToday: '2038-01-01' } })

      expect(res).toBe('?sortKey=selected&sortOrder=ASC')
    })

    test('defaults sort order', () => {
      const res = getCheckboxSortQueryString({ query: { today: '2038-01-01', sortKey: 'selected' } })

      expect(res).toBe('&sortKey=selected&sortOrder=ASC')
    })

    test('toggles sort order to DESC', () => {
      const res = getCheckboxSortQueryString({ query: { today: '2038-01-01', sortKey: 'selected', sortOrder: 'ASC' } })

      expect(res).toBe('&sortKey=selected&sortOrder=DESC')
    })

    test('toggles sort order to ASC', () => {
      const res = getCheckboxSortQueryString({ query: { today: '2038-01-01', sortKey: 'selected', sortOrder: 'DESC' } })

      expect(res).toBe('&sortKey=selected&sortOrder=ASC')
    })
  })

  describe('handleCheckboxSort', () => {
    test('returns no change', () => {
      const res = handleCheckboxSort({ query: { sortKey: 'something else' } }, dogRows, dogSelections1)

      expect(res).toEqual(dogRows)
    })

    test('sorts to DESC', () => {
      const res = handleCheckboxSort({ query: { sortKey: 'selected' } }, dogRows, dogSelections1)

      expect(res.length).toBe(5)
      expect(res[0].indexNumber).toBe('ED0004')
      expect(res[1].indexNumber).toBe('ED0005')
      expect(res[2].indexNumber).toBe('ED0001')
      expect(res[3].indexNumber).toBe('ED0002')
      expect(res[4].indexNumber).toBe('ED0003')
    })

    test('sorts to DESC when specified', () => {
      const res = handleCheckboxSort({ query: { sortKey: 'selected', sortOrder: 'DESC' } }, dogRows, dogSelections1)

      expect(res.length).toBe(5)
      expect(res[0].indexNumber).toBe('ED0004')
      expect(res[1].indexNumber).toBe('ED0005')
      expect(res[2].indexNumber).toBe('ED0001')
      expect(res[3].indexNumber).toBe('ED0002')
      expect(res[4].indexNumber).toBe('ED0003')
    })

    test('sorts to ASC when specified', () => {
      const res = handleCheckboxSort({ query: { sortKey: 'selected', sortOrder: 'ASC' } }, dogRows, dogSelections2)

      expect(res.length).toBe(5)
      expect(res[0].indexNumber).toBe('ED0004')
      expect(res[1].indexNumber).toBe('ED0005')
      expect(res[2].indexNumber).toBe('ED0001')
      expect(res[3].indexNumber).toBe('ED0002')
      expect(res[4].indexNumber).toBe('ED0003')
    })
  })
})
