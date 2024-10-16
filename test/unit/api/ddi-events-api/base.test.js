const wreck = require('@hapi/wreck')
const { user } = require('../../../mocks/auth')
const { ApiErrorFailure } = require('../../../../app/errors/api-error-failure')
const { NotAuthorizedError } = require('../../../../app/errors/not-authorized-error')
const jwtUtilsStub = require('../../../../app/auth/jwt-utils')
const { audiences } = require('../../../../app/constants/auth')

jest.mock('@hapi/wreck')

describe('Base API', () => {
  let createBearerHeaderSpy = jest.spyOn(jwtUtilsStub, 'createBearerHeader')
  const { get, post, callDelete, postWithBoom } = require('../../../../app/api/ddi-events-api/base')
  const wreckReadToString = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    createBearerHeaderSpy = jest.spyOn(jwtUtilsStub, 'createBearerHeader')
    wreckReadToString.mockReturnValue(JSON.stringify({ result: 'ok' }))
    wreck.get.mockResolvedValue({ payload: { result: 'ok' } })
    wreck.post.mockResolvedValue({ payload: '{"resultCode": 200}' })
    wreck.delete.mockResolvedValue({ payload: '' })
    wreck.request.mockResolvedValue({ statusCode: 200, statusMessage: 'Ok', payload: Buffer.from('{"resultCode": 200}') })
    wreck.read.mockResolvedValue({ toString: wreckReadToString })
  })

  test('get should call GET with user', async () => {
    await get('endpoint1', user)
    expect(createBearerHeaderSpy).toHaveBeenCalledWith(audiences.events)
    expect(wreck.get).toHaveBeenCalledWith('test-events/endpoint1', { json: true, headers: { 'ddi-username': 'test@example.com', Authorization: expect.any(String) } })
  })

  test('post should call POST with username in header', async () => {
    await post('endpoint2', { val: 123 }, user)
    expect(createBearerHeaderSpy).toHaveBeenCalledWith(audiences.events)
    expect(wreck.post).toHaveBeenCalledWith('test-events/endpoint2', { payload: { val: 123 }, headers: { 'ddi-username': 'test@example.com', Authorization: expect.any(String) } })
  })

  test('delete should not call DELETE if no actioningUser', async () => {
    await expect(callDelete('endpoint3')).rejects.toThrow(new NotAuthorizedError('User required for this action'))
    expect(wreck.delete).not.toHaveBeenCalled()
  })

  test('delete should call DELETE with username in header', async () => {
    await callDelete('endpoint3', user)
    expect(createBearerHeaderSpy).toHaveBeenCalledWith(audiences.events)
    expect(wreck.delete).toHaveBeenCalledWith('test-events/endpoint3', { headers: { 'ddi-username': 'test@example.com', Authorization: expect.any(String) } })
  })

  test('postWithBoom should call request POST', async () => {
    const res = await postWithBoom('endpoint2', { val: 123 }, user)
    expect(createBearerHeaderSpy).toHaveBeenCalledWith(audiences.events)
    expect(wreck.read).toBeCalledWith({ statusCode: 200, statusMessage: 'Ok', payload: Buffer.from('{"resultCode": 200}') })
    expect(res).toEqual({ statusCode: 200, statusMessage: 'Ok', payload: { result: 'ok' } })
    expect(wreck.request).toHaveBeenCalledWith('POST', 'test-events/endpoint2', { payload: { val: 123 } }, { headers: { 'ddi-username': 'test@example.com', Authorization: expect.any(String) } })
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
    expect(wreck.request).toHaveBeenCalledWith('POST', 'test-events/endpoint2', { payload: { val: 123 }, headers: { 'ddi-username': 'test@example.com', Authorization: expect.any(String) } })
  })
})
