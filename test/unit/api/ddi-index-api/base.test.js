const { user } = require('../../../mocks/auth')
const wreck = require('@hapi/wreck')
jest.mock('@hapi/wreck')

describe('Base API', () => {
  const { get, post, put, callDelete } = require('../../../../app/api/ddi-index-api/base')

  beforeEach(() => {
    jest.clearAllMocks()
    wreck.get.mockResolvedValue({ payload: { result: 'ok' } })
    wreck.post.mockResolvedValue({ payload: '{"resultCode": 200}' })
    wreck.put.mockResolvedValue({ payload: '{"resultCode": 200}' })
    wreck.delete.mockResolvedValue({ payload: '{"resultCode": 200}' })
  })

  test('get should call GET', async () => {
    await get('endpoint1')
    expect(wreck.get).toHaveBeenCalledWith('test/endpoint1', { json: true })
  })

  test('get should call GET with username in header', async () => {
    await get('endpoint1', user)
    expect(wreck.get).toHaveBeenCalledWith('test/endpoint1', { json: true, headers: { 'ddi-username': 'test@example.com' } })
  })

  test('post should call POST', async () => {
    await post('endpoint2', { val: 123 })
    expect(wreck.post).toHaveBeenCalledWith('test/endpoint2', { payload: { val: 123 } })
  })

  test('post should call POST with username in header', async () => {
    await post('endpoint2', { val: 123 }, user)
    expect(wreck.post).toHaveBeenCalledWith('test/endpoint2', { payload: { val: 123 }, headers: { 'ddi-username': 'test@example.com' } })
  })

  test('put should call PUT', async () => {
    await put('endpoint3', { val: 456 })
    expect(wreck.put).toHaveBeenCalledWith('test/endpoint3', { payload: { val: 456 } })
  })

  test('put should call PUT with username in header', async () => {
    await put('endpoint3', { val: 456 }, user)
    expect(wreck.put).toHaveBeenCalledWith('test/endpoint3', { payload: { val: 456 }, headers: { 'ddi-username': 'test@example.com' } })
  })

  test('delete should call DELETE', async () => {
    await callDelete('endpoint3')
    expect(wreck.delete).toHaveBeenCalledWith('test/endpoint3', { json: true })
  })

  test('delete should call DELETE with username in header', async () => {
    await callDelete('endpoint3', user)
    expect(wreck.delete).toHaveBeenCalledWith('test/endpoint3', { json: true, headers: { 'ddi-username': 'test@example.com' } })
  })
})
