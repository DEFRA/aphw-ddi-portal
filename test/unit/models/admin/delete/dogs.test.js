const { getAriaSort, columnLink } = require('../../../../../app/models/admin/delete/dogs')
describe('Dogs model', () => {
  describe('getAriaSort', () => {
    test('no column supplied', () => {
      const sort = {
        column: 'status',
        order: 'ASC'
      }

      const res = getAriaSort(sort)

      expect(res).toBe('ascending')
    })

    test('column supplied', () => {
      const sort = {
        column: 'status',
        order: 'ASC'
      }

      const res = getAriaSort(sort, 'status')

      expect(res).toBe('ascending')
    })

    test('column supplied with DESC', () => {
      const sort = {
        column: 'status',
        order: 'DESC'
      }

      const res = getAriaSort(sort, 'status')

      expect(res).toBe('descending')
    })

    test('column different to sort column', () => {
      const sort = {
        column: 'status',
        order: 'ASC'
      }

      const res = getAriaSort(sort, 'indexNumber')

      expect(res).toBe('none')
    })
  })

  describe('columnLink', () => {
    test('no column supplied', () => {
      const sort = {
        column: 'status',
        order: 'ASC'
      }

      const res = columnLink(sort)

      expect(res).toBe('?sortKey=status&sortOrder=DESC')
    })

    test('column supplied ASC', () => {
      const sort = {
        column: 'status',
        order: 'ASC'
      }

      const res = columnLink(sort, 'status')

      expect(res).toBe('?sortKey=status&sortOrder=DESC')
    })

    test('column supplied DESC', () => {
      const sort = {
        column: 'status',
        order: 'DESC'
      }

      const res = columnLink(sort, 'status')

      expect(res).toBe('?sortKey=status&sortOrder=ASC')
    })

    test('column supplied ASC but different from sort column', () => {
      const sort = {
        column: 'indexNumber',
        order: 'ASC'
      }

      const res = columnLink(sort, 'status')

      expect(res).toBe('?sortKey=status&sortOrder=ASC')
    })

    test('column supplied DESC but different from sort column', () => {
      const sort = {
        column: 'indexNumber',
        order: 'DESC'
      }

      const res = columnLink(sort, 'status')

      expect(res).toBe('?sortKey=status&sortOrder=ASC')
    })
  })
})
