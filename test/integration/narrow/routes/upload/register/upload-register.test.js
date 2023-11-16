const { Readable } = require('stream')
const FormData = require('form-data')
const { admin } = require('../../../../../../app/auth/permissions')

describe('Upload register', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/storage/register-blob-repository')
  const { uploadRegisterFile } = require('../../../../../../app/storage/register-blob-repository')

  jest.mock('../../../../../../app/storage/register-status-repository')

  jest.mock('../../../../../../app/messaging/outbound')
  const { sendMessage } = require('../../../../../../app/messaging/outbound')

  const createServer = require('../../../../../../app/server')
  let server

  const auth = { strategy: 'session-auth', credentials: { scope: [admin] } }

  const user = {
    userId: '1',
    username: 'test@example.com'
  }

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /upload/register route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/upload/register',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
  })

  test('POST /upload/register route returns 302', async () => {
    const file = Buffer.from('test')

    const fd = new FormData()
    fd.append('register', file, { filename: 'test.xlsx' })

    const options = {
      method: 'POST',
      url: '/upload/register',
      auth,
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    jest.spyOn(global.Date.prototype, 'toISOString').mockReturnValue('2023-11-14T00:00:00.000Z')

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(uploadRegisterFile).toHaveBeenCalledWith('ddi-register-2023-11-14T00:00:00.000Z', expect.any(Readable))
    expect(sendMessage).toHaveBeenCalledWith({
      filename: 'ddi-register-2023-11-14T00:00:00.000Z',
      email: 'test@example.com'
    })
  })

  test('POST /upload/register with missing register returns 200', async () => {
    const fd = new FormData()

    const options = {
      method: 'POST',
      url: '/upload/register',
      auth,
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
    expect(uploadRegisterFile).not.toHaveBeenCalled()
    expect(sendMessage).not.toHaveBeenCalled()
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
