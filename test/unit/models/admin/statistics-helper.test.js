const { sumTotals, prepareCountryCounts } = require('../../../../app/models/admin/statistics-helper')
const { statsPerCountryRows } = require('../../../mocks/statistics')

describe('Statistics model', () => {
  describe('sumTotals', () => {
    test('sumsTotals when many', () => {
      const res = sumTotals([
        { total: 123 },
        { total: 22 },
        { total: 50 }
      ])
      expect(res).toBe(195)
    })

    test('sumsTotals when single', () => {
      const res = sumTotals([
        { total: 441 }
      ])
      expect(res).toBe(441)
    })
  })

  describe('prepareCountryCounts', () => {
    test('extracts correct stats', () => {
      const { breeds, countries, rowsPerBreed, totalsPerCountry, totalsPerBreed } = prepareCountryCounts(statsPerCountryRows)
      expect(breeds).toEqual(['XL Bully', 'Breed 2', 'Breed 3'])
      expect(countries).toEqual(['England', 'Wales', 'Scotland'])
      expect(rowsPerBreed).toEqual({
        'XL Bully': [
          { breed: 'XL Bully', country: 'England', total: 55 },
          { breed: 'XL Bully', country: 'Wales', total: 2 },
          { breed: 'XL Bully', country: 'Scotland', total: 30 }
        ],
        'Breed 2': [
          { breed: 'Breed 2', country: 'England', total: 257 },
          { breed: 'Breed 2', country: 'Wales', total: 44 },
          { breed: 'Breed 2', country: 'Scotland', total: 10 }
        ],
        'Breed 3': [
          { breed: 'Breed 3', country: 'England', total: 128 },
          { breed: 'Breed 3', country: 'Wales', total: 15 },
          { breed: 'Breed 3', country: 'Scotland', total: 33 }
        ]
      })
      expect(totalsPerCountry).toEqual({ England: 440, Wales: 61, Scotland: 73 })
      expect(totalsPerBreed).toEqual({ 'XL Bully': 87, 'Breed 2': 311, 'Breed 3': 176 })
    })
  })
})
