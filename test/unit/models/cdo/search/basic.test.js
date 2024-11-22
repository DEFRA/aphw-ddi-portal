const ViewModel = require('../../../../../app/models/cdo/search/basic')

describe('Confirm Dog and Owner ViewModel', () => {
  test('should allow backNav', () => {
    const model = new ViewModel({
      confirmHint: 'hint',
      firstName: 'Joe',
      lastName: 'Bloggs',
      ownerPk: 'P-1234-5678',
      pk: 'ED300002'
    }, { results: [], totalFOund: 0 }, '/url', {})

    expect(model.model.results.items).toEqual([])
  })
})
