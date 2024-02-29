const { get } = require('../../../../app/api/ddi-events-api/base')
const { getEvents } = require('../../../../app/api/ddi-events-api/event')
jest.mock('../../../../app/api/ddi-events-api/base')

describe('event test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('getEvents calls endpoint', async () => {
    get.mockResolvedValue({ payload: {} })
    await getEvents(['ED12345'])
    expect(get).toHaveBeenCalledWith('events?pks=ED12345')
  })
  test('getEvents calls endpoint with multiple indexes', async () => {
    get.mockResolvedValue({ payload: {} })
    await getEvents(['ED12345', 'ED23456'])
    expect(get).toHaveBeenCalledWith('events?pks=ED12345,ED23456')
  })
})
