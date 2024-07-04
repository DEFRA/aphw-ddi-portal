const ViewModel = require('../../../../app/models/admin/statistics')
const { statsPerStatusRows, statsPerCountryRows } = require('../../../mocks/statistics')

describe('Statistics model', () => {
  test('creates model', () => {
    const res = new ViewModel(statsPerStatusRows, statsPerCountryRows)
    expect(res.model.countsPerStatus.total).toBe(6220)
    expect(res.model.countsPerCountry.total).toBe(544)
  })
})
