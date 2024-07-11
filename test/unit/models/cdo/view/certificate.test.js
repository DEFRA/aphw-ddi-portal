const ViewModel = require('../../../../../app/models/cdo/view/certificate')

describe('Certificate Model', () => {
  test('should handle backnav when not from manage CDO', () => {
    const backNav = { backLink: '/some-non-root-url' }
    const indexNumber = 'ED12345'
    const origin = null
    const res = new ViewModel(indexNumber, origin, backNav)
    expect(res.model.backLink).toBe('/some-non-root-url')
  })

  test('should handle backnav when arrived from manage CDO', () => {
    const backNav = { backLink: '/some-non-root-url' }
    const indexNumber = 'ED12345'
    const origin = 'manage-cdo'
    const res = new ViewModel(indexNumber, origin, backNav)
    expect(res.model.backLink).toBe('/cdo/manage')
  })
})
