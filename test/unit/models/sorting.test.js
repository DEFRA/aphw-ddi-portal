const { getAriaSortBuilder, columnLinkBuilder } = require('../../../app/models/sorting')

describe('sorting', () => {
  describe('getAriaSortBuilder', () => {
    test('should deal with defaults', () => {
      const ariaSort = getAriaSortBuilder('owner')({ column: 'owner' }, undefined)
      expect(ariaSort).toBe('ascending')
    })

    test('should deal with unmatched default column', () => {
      const ariaSort = getAriaSortBuilder('owner')({ column: 'dateOfBirth' }, undefined)
      expect(ariaSort).toBe('none')
    })

    test('should deal with defaults and set default order', () => {
      const ariaSort = getAriaSortBuilder('owner')({ column: 'owner', order: 'ASC' }, undefined)
      expect(ariaSort).toBe('ascending')
    })

    test('should deal with defaults and descending', () => {
      const ariaSort = getAriaSortBuilder('owner')({ column: 'owner', order: 'DESC' }, undefined)
      expect(ariaSort).toBe('descending')
    })

    test('should deal with different columns that are matched', () => {
      const ariaSort = getAriaSortBuilder('owner')({ column: 'dateOfBirth', order: 'ASC' }, 'dateOfBirth')
      expect(ariaSort).toBe('ascending')
    })

    test('should deal with different columns that are unmatched', () => {
      const ariaSort = getAriaSortBuilder('owner')({ column: 'owner', order: 'DESC' }, 'dateOfBirth')
      expect(ariaSort).toBe('none')
    })
  })

  describe('columnLinkBuilder', () => {
    test('should create column link default', () => {
      const columnLink = columnLinkBuilder('owner')({ column: 'owner', order: 'ASC' }, undefined)
      expect(columnLink).toBe('?sortKey=owner&sortOrder=DESC')
    })

    test('should create column link default with default set', () => {
      const columnLink = columnLinkBuilder('owner')({ column: 'owner', order: 'ASC' }, 'owner')
      expect(columnLink).toBe('?sortKey=owner&sortOrder=DESC')
    })

    test('should create column link default with DESC', () => {
      const columnLink = columnLinkBuilder('owner')({ column: 'owner', order: 'DESC' }, undefined)
      expect(columnLink).toBe('?sortKey=owner&sortOrder=ASC')
    })

    test('should create column link with no sort set', () => {
      const columnLink = columnLinkBuilder('owner')({ column: 'owner' }, undefined)
      expect(columnLink).toBe('?sortKey=owner&sortOrder=ASC')
    })

    test('should create column link with non-default sort set', () => {
      const columnLink = columnLinkBuilder('owner')({ column: 'address', order: 'ASC' }, 'address')
      expect(columnLink).toBe('?sortKey=address&sortOrder=DESC')
    })
  })
})
