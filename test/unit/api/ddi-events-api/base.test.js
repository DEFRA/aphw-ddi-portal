const wreck = require('@hapi/wreck')
jest.mock('@hapi/wreck')

describe('Base API', () => {
  const { get } = require('../../../../app/api/ddi-events-api/base')

  beforeEach(() => {
    jest.clearAllMocks()
    wreck.get.mockResolvedValue({ payload: { result: 'ok' } })
  })

  test('get should call GET', async () => {
    await get('endpoint1')
    expect(wreck.get).toHaveBeenCalledWith('test-events/endpoint1', { json: true })
  })
})
