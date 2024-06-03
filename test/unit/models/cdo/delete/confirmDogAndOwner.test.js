const ViewModel = require('../../../../../app/models/cdo/delete/confimDogAndOwner')

describe('Confirm Dog and Owner ViewModel', () => {
  test('should allow backNav', () => {
    const backNav = {
      backLink: 'https://example-backlink.com/en'
    }
    const model = new ViewModel({
      confirmHint: 'hint',
      firstName: 'Joe',
      lastName: 'Bloggs',
      ownerPk: 'P-1234-5678',
      pk: 'ED300002'
    }, backNav)

    expect(model.model.backLink).toBe('https://example-backlink.com/en')
  })
})
