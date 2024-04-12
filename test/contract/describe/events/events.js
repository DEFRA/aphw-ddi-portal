const {
  activityEventExists,
  updatedDogExists,
  createdDogWithOwnerV1,
  createdDogWithOwnerV2
} = require('../../interactions/events/events')
const { flatMapActivityDtoToCheckActivityRow } = require('../../../../app/models/mappers/check-activities')

const eventsTests = (ddiEventsApiProvider) => {
  let eventsApi

  beforeAll(() => {
    eventsApi = require('../../../../app/api/ddi-events-api/event')
  })

  test('GET /events with activity', async () => {
    await ddiEventsApiProvider.addInteraction(activityEventExists)

    const response = await eventsApi.getEvents(['ED300000'])
    expect(() => flatMapActivityDtoToCheckActivityRow(response.events)).not.toThrow()
  })

  test('GET /events with updated dog', async () => {
    await ddiEventsApiProvider.addInteraction(updatedDogExists)

    const response = await eventsApi.getEvents(['ED300000'])
    expect(() => flatMapActivityDtoToCheckActivityRow(response.events)).not.toThrow()
  })

  test('GET /events with created dog and owner v1', async () => {
    await ddiEventsApiProvider.addInteraction(createdDogWithOwnerV1)

    const response = await eventsApi.getEvents(['ED300000', 'P-B218-7D57'])
    expect(() => flatMapActivityDtoToCheckActivityRow(response.events)).not.toThrow()
  })

  test('GET /events with created dog and owner v2', async () => {
    await ddiEventsApiProvider.addInteraction(createdDogWithOwnerV2)

    const response = await eventsApi.getEvents(['ED300000', 'P-B218-7D57'])
    expect(() => flatMapActivityDtoToCheckActivityRow(response.events)).not.toThrow()
  })
}

module.exports = {
  eventsTests
}
