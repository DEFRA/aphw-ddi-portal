const wreck = require('@hapi/wreck')
const { user } = require('../../../mocks/auth')
jest.mock('@hapi/wreck')

describe('Base API', () => {
  const { get, post, callDelete } = require('../../../../app/api/ddi-events-api/base')

  beforeEach(() => {
    jest.clearAllMocks()
    wreck.get.mockResolvedValue({ payload: { result: 'ok' } })
    wreck.post.mockResolvedValue({ payload: '{"resultCode": 200}' })
    wreck.delete.mockResolvedValue({ payload: '' })
  })

  test('get should call GET', async () => {
    await get('endpoint1')
    expect(wreck.get).toHaveBeenCalledWith('test-events/endpoint1', { json: true })
  })

  test('get should call GET with user', async () => {
    await get('endpoint1', user)
    expect(wreck.get).toHaveBeenCalledWith('test-events/endpoint1', { json: true, headers: { 'ddi-username': 'test@example.com' } })
  })

  test('post should call POST', async () => {
    await post('endpoint2', { val: 123 })
    expect(wreck.post).toHaveBeenCalledWith('test-events/endpoint2', { payload: { val: 123 } })
  })

  test('post should call POST with username in header', async () => {
    await post('endpoint2', { val: 123 }, user)
    expect(wreck.post).toHaveBeenCalledWith('test-events/endpoint2', { payload: { val: 123 }, headers: { 'ddi-username': 'test@example.com' } })
  })

  test('delete should call DELETE', async () => {
    await callDelete('endpoint3')
    expect(wreck.delete).toHaveBeenCalledWith('test-events/endpoint3', {})
  })

  test('delete should call DELETE with username in header', async () => {
    await callDelete('endpoint3', user)
    expect(wreck.delete).toHaveBeenCalledWith('test-events/endpoint3', { headers: { 'ddi-username': 'test@example.com' } })
  })
})
