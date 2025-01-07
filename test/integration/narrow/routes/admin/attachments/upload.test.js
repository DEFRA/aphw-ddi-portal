const { auth, user } = require('../../../../../mocks/auth')
const { Readable } = require('stream')
const FormData = require('form-data')

describe('Upload attachments', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/storage/repos/blob')
  const { uploadFile } = require('../../../../../../app/storage/repos/blob')

  jest.mock('../../../../../../app/api/ddi-index-api/import')
  const { doImport } = require('../../../../../../app/api/ddi-index-api/import')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    doImport.mockResolvedValue({})
    server = await createServer()
    await server.initialize()
  })

  describe('GET /admin/attachments/upload route', () => {
    test('returns 200', async () => {
      const options = {
        method: 'GET',
        url: '/admin/attachments/upload',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)
    })
  })

  describe('POST /admin/attachments/upload route', () => {
    test('returns 302', async () => {
      const file = Buffer.from('test')

      const fd = new FormData()
      fd.append('upload', file, { filename: 'test.pdf' })

      const options = {
        method: 'POST',
        url: '/admin/attachments/upload',
        auth,
        headers: fd.getHeaders(),
        payload: fd.getBuffer()
      }

      jest.spyOn(global.Date.prototype, 'toISOString').mockReturnValue('2023-11-14T00:00:00.000Z')

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(uploadFile).toHaveBeenCalledWith('attachments', 'test.2023-11-14T00:00:00.000Z.draft.pdf', expect.any(Readable))
    })

    test('with missing register returns 200', async () => {
      const fd = new FormData()

      const options = {
        method: 'POST',
        url: '/admin/attachments/upload',
        auth,
        headers: fd.getHeaders(),
        payload: fd.getBuffer()
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)
      expect(uploadFile).not.toHaveBeenCalled()
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
