const { user, keyStubs } = require('../../../mocks/auth')
const wreck = require('@hapi/wreck')
const { ApiErrorFailure } = require('../../../../app/errors/api-error-failure')
const { get } = require('../../../../app/api/ddi-index-api/base')
jest.mock('@hapi/wreck')

describe('Base API', () => {
  jest.mock('../../../../app/lib/environment-helpers')
  const { getEnvironmentVariable } = require('../../../../app/lib/environment-helpers')

  getEnvironmentVariable.mockImplementation((envVar) => {
    if (envVar === 'JWT_PRIVATE_KEY') {
      return keyStubs.privateKeyHash
    }

    if (envVar === 'DDI_API_BASE_URL') {
      return 'test'
    }

    return process.env[envVar]
  })
  const { get, post, put, callDelete, boomRequest } = require('../../../../app/api/ddi-index-api/base')
  const wreckReadToString = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    wreckReadToString.mockReturnValue(JSON.stringify({ result: 'ok' }))
    wreck.get.mockResolvedValue({ payload: { result: 'ok' } })
    wreck.post.mockResolvedValue({ payload: '{"resultCode": 200}' })
    wreck.put.mockResolvedValue({ payload: '{"resultCode": 200}' })
    wreck.delete.mockResolvedValue({ payload: '{"resultCode": 200}' })
    wreck.request.mockResolvedValue({ statusCode: 200, statusMessage: 'Ok', payload: Buffer.from('{"resultCode": 200}') })
    wreck.read.mockResolvedValue({ toString: wreckReadToString })
  })

  describe('GET', () => {
    test('get should call GET', async () => {
      await get('endpoint1')
      expect(wreck.get).toHaveBeenCalledWith('test/endpoint1', { json: true })
    })

    test('get should call GET with username in header', async () => {
      await get('endpoint1', user)
      expect(wreck.get).toHaveBeenCalledWith('test/endpoint1', { json: true, headers: { 'ddi-username': 'test@example.com', Authorization: expect.any(String) } })
    })

    test('should handle URL objects', async () => {
      const url = new URL('http://example.com/endpoint1')
      await get(url, user)
      expect(wreck.get).toHaveBeenCalledWith('http://example.com/endpoint1', { json: true, headers: { 'ddi-username': 'test@example.com', Authorization: expect.any(String) } })
    })
  })

  describe('POST', () => {
    test('post should call POST', async () => {
      await post('endpoint2', { val: 123 })
      expect(wreck.post).toHaveBeenCalledWith('test/endpoint2', { payload: { val: 123 } })
    })

    test('post should call POST with username in header', async () => {
      await post('endpoint2', { val: 123 }, user)
      expect(wreck.post).toHaveBeenCalledWith('test/endpoint2', { payload: { val: 123 }, headers: { 'ddi-username': 'test@example.com', Authorization: expect.any(String) } })
    })

    test('post should not fail given an empty payload', async () => {
      wreck.post.mockResolvedValue({ payload: { toString () { return '' } } })
      await post('endpoint2', { val: 123 }, user)
      expect(wreck.post).toHaveBeenCalledWith('test/endpoint2', { payload: { val: 123 }, headers: { 'ddi-username': 'test@example.com', Authorization: expect.any(String) } })
    })
  })

  describe('PUT', () => {
    test('put should call PUT', async () => {
      await put('endpoint3', { val: 456 })
      expect(wreck.put).toHaveBeenCalledWith('test/endpoint3', { payload: { val: 456 } })
    })

    test('put should call PUT with username in header', async () => {
      await put('endpoint3', { val: 456 }, user)
      expect(wreck.put).toHaveBeenCalledWith('test/endpoint3', { payload: { val: 456 }, headers: { 'ddi-username': 'test@example.com', Authorization: expect.any(String) } })
    })
  })

  describe('DELETE', () => {
    test('delete should call DELETE', async () => {
      await callDelete('endpoint3')
      expect(wreck.delete).toHaveBeenCalledWith('test/endpoint3', { json: true })
    })

    test('delete should call DELETE with username in header', async () => {
      await callDelete('endpoint3', user)
      expect(wreck.delete).toHaveBeenCalledWith('test/endpoint3', { json: true, headers: { 'ddi-username': 'test@example.com', Authorization: expect.any(String) } })
    })
  })

  describe('Boom Request', () => {
    test('boomRequest should call request PUT', async () => {
      const res = await boomRequest('endpoint2', 'PUT', { val: 123 })
      expect(wreck.read).toBeCalledWith({ statusCode: 200, statusMessage: 'Ok', payload: Buffer.from('{"resultCode": 200}') })
      expect(res).toEqual({ statusCode: 200, statusMessage: 'Ok', payload: { result: 'ok' } })
      expect(wreck.request).toHaveBeenCalledWith('PUT', 'test/endpoint2', { payload: { val: 123 } })
    })

    test('should not fail given an empty payload', async () => {
      wreck.read.mockResolvedValue({ toString () { return '' } })
      const response = await post('endpoint2', { val: 123 }, user)
      expect(response.payload).toBeUndefined()
    })

    test('postWithBoom should return a valid error object if request failed', async () => {
      wreck.request.mockResolvedValue({ statusCode: 409, statusMessage: 'Conflict', payload: Buffer.from('{"error":"Username already exists","message":"Username already exists","statusCode":409}') })
      wreckReadToString.mockReturnValue(JSON.stringify({ error: 'Username already exists', message: 'Username already exists', statusCode: 409 }))
      wreck.read.mockResolvedValue({ toString: wreckReadToString })
      await expect(boomRequest('endpoint2', 'PUT', { val: 123 })).rejects.toThrow(new ApiErrorFailure('409 Conflict', { error: 'Username already exists', message: 'Username already exists', statusCode: 409 }))
    })

    test('postWithBoom should call request PUT with username in header', async () => {
      const res = await boomRequest('endpoint2', 'PUT', { val: 123 }, user)
      expect(res).toEqual({ statusCode: 200, statusMessage: 'Ok', payload: { result: 'ok' } })
      expect(wreck.request).toHaveBeenCalledWith('PUT', 'test/endpoint2', { payload: { val: 123 }, headers: { 'ddi-username': 'test@example.com', Authorization: expect.any(String) } })
    })
  })
})
