const wreck = require('@hapi/wreck')
const { user } = require('../../../mocks/auth')
const { ApiErrorFailure } = require('../../../../app/errors/apiErrorFailure')
const { NotAuthorizedError } = require('../../../../app/errors/notAuthorizedError')
jest.mock('@hapi/wreck')

describe('Base API', () => {
  const { get, post, callDelete, postWithBoom } = require('../../../../app/api/ddi-events-api/base')
  const wreckReadToString = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    wreckReadToString.mockReturnValue(JSON.stringify({ result: 'ok' }))
    wreck.get.mockResolvedValue({ payload: { result: 'ok' } })
    wreck.post.mockResolvedValue({ payload: '{"resultCode": 200}' })
    wreck.delete.mockResolvedValue({ payload: '' })
    wreck.request.mockResolvedValue({ statusCode: 200, statusMessage: 'Ok', payload: Buffer.from('{"resultCode": 200}') })
    wreck.read.mockResolvedValue({ toString: wreckReadToString })
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

  test('delete should not call DELETE if no actioningUser', async () => {
    await expect(callDelete('endpoint3')).rejects.toThrow(new NotAuthorizedError('User required for this action'))
    expect(wreck.delete).not.toHaveBeenCalled()
  })

  test('delete should call DELETE with username in header', async () => {
    await callDelete('endpoint3', user)
    expect(wreck.delete).toHaveBeenCalledWith('test-events/endpoint3', { headers: { 'ddi-username': 'test@example.com' } })
  })

  test('postWithBoom should call request POST', async () => {
    const res = await postWithBoom('endpoint2', { val: 123 })
    expect(wreck.read).toBeCalledWith({ statusCode: 200, statusMessage: 'Ok', payload: Buffer.from('{"resultCode": 200}') })
    expect(res).toEqual({ statusCode: 200, statusMessage: 'Ok', payload: { result: 'ok' } })
    expect(wreck.request).toHaveBeenCalledWith('POST', 'test-events/endpoint2', { payload: { val: 123 } })
  })

  test('postWithBoom should return a valid error object if request failed', async () => {
    wreck.request.mockResolvedValue({ statusCode: 409, statusMessage: 'Conflict', payload: Buffer.from('{"error":"Username already exists","message":"Username already exists","statusCode":409}') })
    wreckReadToString.mockReturnValue(JSON.stringify({ error: 'Username already exists', message: 'Username already exists', statusCode: 409 }))
    wreck.read.mockResolvedValue({ toString: wreckReadToString })
    await expect(postWithBoom('endpoint2', { val: 123 })).rejects.toThrow(new ApiErrorFailure('409 Conflict', { error: 'Username already exists', message: 'Username already exists', statusCode: 409 }))
  })

  test('postWithBoom should call request POST with username in header', async () => {
    const res = await postWithBoom('endpoint2', { val: 123 }, user)
    expect(res).toEqual({ statusCode: 200, statusMessage: 'Ok', payload: { result: 'ok' } })
    expect(wreck.request).toHaveBeenCalledWith('POST', 'test-events/endpoint2', { payload: { val: 123 }, headers: { 'ddi-username': 'test@example.com' } })
  })
})
