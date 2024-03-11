const { getActivitiesInteraction, activitiesResponseSingleEntry } = require('../interactions/api/activities')

const activitiesTests = (ddiIndexApiProvider) => {
  let activitiesApi

  beforeAll(() => {
    activitiesApi = require('../../../app/api/ddi-index-api/activities')
  })

  test('GET /activities', async () => {
    await ddiIndexApiProvider.addInteraction(getActivitiesInteraction)

    const response = await activitiesApi.getActivities('type', 'source')
    expect(response[0]).toEqual(activitiesResponseSingleEntry)
  })
}

module.exports = {
  activitiesTests
}
