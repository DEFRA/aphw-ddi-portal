const { userWithDisplayname } = require('../../mocks/auth')
const { recordActivityInteraction } = require('../interactions/api/activity')
const { validActivityRequest } = require('../matchers/activity')

const activityTests = (ddiIndexApiProvider) => {
  let activityApi

  jest.mock('../../../app/api/ddi-index-api/activities')
  const { getActivityById } = require('../../../app/api/ddi-index-api/activities')

  jest.mock('../../../app/api/ddi-index-api/dog')
  const { getDogOwner } = require('../../../app/api/ddi-index-api/dog')

  beforeAll(() => {
    activityApi = require('../../../app/api/ddi-index-api/activities')
  })

  test('POST /activity with mandatory data', async () => {
    getActivityById.mockResolvedValue({ activity_event: { target_primary_key: 'owner' } })
    getDogOwner.mockResolvedValue({ personReference: 'p-123' })
    await ddiIndexApiProvider.addInteraction(recordActivityInteraction())

    const response = await activityApi.recordActivity(validActivityRequest, userWithDisplayname)
    expect(response).toBe('ok')
  })
}
/*
  describe('/activities', () => {
    let activitiesApi

    beforeAll(() => {
      activitiesApi = require('../../app/api/ddi-index-api/activities')
    })

    test('GET /activities', async () => {
      await ddiIndexApiProvider.addInteraction({
        state: 'activities list exists',
        uponReceiving: 'get all activities',
        withRequest: {
          method: 'GET',
          path: '/activities'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: {
            countries: Matchers.eachLike('England', null)
          }
        }
      })

      const response = await activitiesApi.getActivityById()
      expect(response[0]).toEqual('England')
    })
  })
*/

module.exports = {
  activityTests
}
