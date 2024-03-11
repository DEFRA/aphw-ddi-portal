const { userWithDisplayname } = require('../../mocks/auth')
const { recordActivityInteraction } = require('../interactions/api/activity')
const { validActivityRequest } = require('../matchers/activity')

const activityPostTests = (ddiIndexApiProvider) => {
  let activityPostApi

  jest.mock('../../../app/api/ddi-index-api/dog')
  const { getDogOwner } = require('../../../app/api/ddi-index-api/dog')

  jest.mock('../../../app/api/ddi-index-api/activity-get')
  const { getActivityById } = require('../../../app/api/ddi-index-api/activity-get')

  beforeAll(() => {
    activityPostApi = require('../../../app/api/ddi-index-api/activity-post')
  })

  test('POST /activity with mandatory data', async () => {
    getActivityById.mockResolvedValue({ activity_event: { target_primary_key: 'owner' } })
    getDogOwner.mockResolvedValue({ personReference: 'p-123' })
    await ddiIndexApiProvider.addInteraction(recordActivityInteraction)

    const response = await activityPostApi.recordActivity(validActivityRequest, userWithDisplayname)
    console.log('response post', response)
    expect(response).toBe('ok')
  })
}

module.exports = {
  activityPostTests
}
