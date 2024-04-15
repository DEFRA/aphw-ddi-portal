const {
  activityEventExists,
  updatedDogExists,
  createdDogWithOwnerV1, updatedPersonExists, updatedDogExistsWithNullValues, createdDogWithOwnerV2,
  updatedPersonExistsFromNull, createdDogWithOwnerV3
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

    const response = await eventsApi.getEvents(['ED300001'])
    expect(() => flatMapActivityDtoToCheckActivityRow(response.events)).not.toThrow()
  })

  test('GET /events with updated dog with null values', async () => {
    await ddiEventsApiProvider.addInteraction(updatedDogExistsWithNullValues)

    const response = await eventsApi.getEvents(['ED300003'])
    expect(() => flatMapActivityDtoToCheckActivityRow(response.events)).not.toThrow()
  })

  test('GET /events with updated person', async () => {
    await ddiEventsApiProvider.addInteraction(updatedPersonExists)

    const response = await eventsApi.getEvents(['P-B218-7D59'])
    expect(() => flatMapActivityDtoToCheckActivityRow(response.events)).not.toThrow()
  })

  test('GET /events with updated person from null values', async () => {
    await ddiEventsApiProvider.addInteraction(updatedPersonExistsFromNull)

    const response = await eventsApi.getEvents(['P-B218-7D62'])
    expect(() => flatMapActivityDtoToCheckActivityRow(response.events)).not.toThrow()
  })

  test('GET /events with created dog and owner v1 single dog', async () => {
    await ddiEventsApiProvider.addInteraction(createdDogWithOwnerV1)
    const response = await eventsApi.getEvents(['ED300002', 'P-B218-7D58'])

    expect(() => flatMapActivityDtoToCheckActivityRow(response.events)).not.toThrow()
  })

  test('GET /events with created dogs and owner v2 multiple dogs', async () => {
    await ddiEventsApiProvider.addInteraction(createdDogWithOwnerV2)

    const response = await eventsApi.getEvents(['ED300004', 'P-B218-7D60'])
    expect(() => flatMapActivityDtoToCheckActivityRow(response.events)).not.toThrow()
  })

  test('GET /events with created dogs and created_at', async () => {
    await ddiEventsApiProvider.addInteraction(createdDogWithOwnerV3)

    const response = await eventsApi.getEvents(['ED300005', 'P-B218-7D61'])
    expect(() => flatMapActivityDtoToCheckActivityRow(response.events)).not.toThrow()
  })
}

module.exports = {
  eventsTests
}
