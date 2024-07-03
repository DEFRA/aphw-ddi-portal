const ViewModel = require('../../../../../../app/models/cdo/manage/tasks/record-verification-dates')

describe('RecordVerificationDates Model', () => {
  test('should handle backnav', () => {
    const backNav = { backLink: '/some-non-root-url' }
    const data = { indexNumber: 'ED12345', task: { completed: false } }
    const res = new ViewModel(data, backNav)
    expect(res.model.backLink).toBe('/some-non-root-url')
  })

  test('should handle root/missing backnav', () => {
    const backNav = { backLink: '/' }
    const data = { indexNumber: 'ED12345', task: { completed: false } }
    const res = new ViewModel(data, backNav)
    expect(res.model.backLink).toBe('/cdo/manage/cdo/ED12345')
  })
})
