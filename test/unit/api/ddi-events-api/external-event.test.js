const { get } = require('../../../../app/api/ddi-events-api/base')
const { getExternalEvents } = require('../../../../app/api/ddi-events-api/external-event')
const { user } = require('../../../mocks/auth')
jest.mock('../../../../app/api/ddi-events-api/base')

describe('external event test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('getExternalEvents calls endpoint', async () => {
    get.mockResolvedValue({ payload: {} })
    await getExternalEvents('?pks=ED12345', user)
    expect(get).toHaveBeenCalledWith('external-events?pks=ED12345', user)
  })
  test('getEvents calls endpoint with multiple params', async () => {
    get.mockResolvedValue({ payload: {} })
    await getExternalEvents('?queryType=dog&pks=ED12345&fromDate=2024-10-05', user)
    expect(get).toHaveBeenCalledWith('external-events?queryType=dog&pks=ED12345&fromDate=2024-10-05', user)
  })
})
