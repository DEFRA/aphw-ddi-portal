const ViewModel = require('../../../../app/models/admin/statistics')
const { statsPerStatusRows, statsPerCountryRows } = require('../../../mocks/statistics')
const { deepClone } = require('../../../../app/lib/model-helpers')

describe('Statistics model', () => {
  test('creates model', () => {
    const res = new ViewModel(statsPerStatusRows, statsPerCountryRows)
    expect(res.model.countsPerStatus.total).toBe(6220)
    expect(res.model.countsPerCountry.total).toBe(544)
  })

  test('creates model even when no scotland xls', () => {
    const countryRows = deepClone(statsPerCountryRows)
    countryRows.splice(2, 1)
    const res = new ViewModel(statsPerStatusRows, countryRows)
    expect(res.model.countsPerStatus.total).toBe(6220)
    expect(res.model.countsPerCountry.total).toBe(544)
  })
})
