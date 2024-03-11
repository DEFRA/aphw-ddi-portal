const { getActivityByIdInteraction, activityResult } = require('../interactions/api/activity')

const activityGetTests = (ddiIndexApiProvider) => {
  let activityGetApi

  beforeAll(() => {
    activityGetApi = require('../../../app/api/ddi-index-api/activity-get')
  })

  test('GET /getActivityById', async () => {
    await ddiIndexApiProvider.addInteraction(getActivityByIdInteraction)

    const response = await activityGetApi.getActivityById(1)
    console.log('response get', response)
    expect(response).toEqual(activityResult)
  })
}

module.exports = {
  activityGetTests
}
