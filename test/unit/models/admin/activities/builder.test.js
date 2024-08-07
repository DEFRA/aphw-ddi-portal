const { ActivityAddedViewModel, disableIfNeeded } = require('../../../../../app/models/admin/activities/builder')
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

    test('should disable as appropriate', () => {
      const rows = [
        { id: 1, label: 'Label 1', activity_type: { name: 'sent' } },
        { id: 2, label: 'Application pack', activity_type: { name: 'sent' } },
        { id: 3, label: 'Label 3', activity_type: { name: 'sent' } },
        { id: 4, label: 'Form 2', activity_type: { name: 'sent' } },
        { id: 5, label: 'Label 1', activity_type: { name: 'received' } },
        { id: 6, label: 'Application pack', activity_type: { name: 'received' } },
        { id: 7, label: 'Label 3', activity_type: { name: 'received' } },
        { id: 8, label: 'Form 2', activity_type: { name: 'received' } }
      ]
      const res = disableIfNeeded(rows)
      expect(res.length).toBe(8)
      expect(res[0].canRemove).toBeTruthy()
      expect(res[1].canRemove).toBeFalsy()
      expect(res[2].canRemove).toBeTruthy()
      expect(res[3].canRemove).toBeFalsy()
      expect(res[4].canRemove).toBeTruthy()
      expect(res[5].canRemove).toBeTruthy()
      expect(res[6].canRemove).toBeTruthy()
      expect(res[7].canRemove).toBeTruthy()
    })

    test('should handle null', () => {
      const res = disableIfNeeded(null)
      expect(res).toBe(null)
    })

    test('should handle empty array', () => {
      const res = disableIfNeeded([])
      expect(res).toEqual([])
    })
  })
})
