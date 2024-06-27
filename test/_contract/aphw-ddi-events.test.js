const { ddiEventsApiProvider } = require('./mockServices')
const { eventsTests } = require('./describe/events/events')

describe('Event service contract test', () => {
  beforeAll(async () => {
    const mockService = ddiEventsApiProvider
    await mockService.setup()
    jest.mock('../../app/config', () => ({
      ddiEventsApi: mockService.mockService
    }))
  })

  describe('/events', () => eventsTests(ddiEventsApiProvider))

  afterEach(async () => {
    await ddiEventsApiProvider.verify()
  })

  afterAll(async () => {
    await ddiEventsApiProvider.finalize()
  })
})
