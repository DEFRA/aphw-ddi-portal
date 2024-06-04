const { ActivityAddedViewModel } = require('../../../../../app/models/admin/activities/builder')
describe('builder', () => {
  describe('ActivityAddedViewModel', () => {
    test('should create receive models', () => {
      const activityAddedViewModel = ActivityAddedViewModel({
        label: 'Judicial review notice',
        activitySource: 'Dog',
        activityType: 'receive'
      })
      expect(activityAddedViewModel.model.bodyContent).toEqual(['Judicial review notice is available in the Dog record receive activities.'])
    })
  })
})
