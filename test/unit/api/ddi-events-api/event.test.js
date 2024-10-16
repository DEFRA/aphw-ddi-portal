const { get } = require('../../../../app/api/ddi-events-api/base')
const { getEvents } = require('../../../../app/api/ddi-events-api/event')
const { user } = require('../../../mocks/auth')
jest.mock('../../../../app/api/ddi-events-api/base')

describe('event test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('getEvents calls endpoint', async () => {
    get.mockResolvedValue({ payload: {} })
    await getEvents(['ED12345'], user)
    expect(get).toHaveBeenCalledWith('events?pks=ED12345', user)
  })
  test('getEvents calls endpoint with multiple indexes', async () => {
    get.mockResolvedValue({ payload: {} })
    await getEvents(['ED12345', 'ED23456'], user)
    expect(get).toHaveBeenCalledWith('events?pks=ED12345,ED23456', user)
  })
})
