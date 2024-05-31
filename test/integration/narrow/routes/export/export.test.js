const { adminAuth, standardAuth, userWithDisplayname } = require('../../../../mocks/auth')

describe('Export test', () => {
  const createServer = require('../../../../../app/server')
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  jest.mock('../../../../../app/api/ddi-index-api/export')
  const { exportAudit } = require('../../../../../app/api/ddi-index-api/export')

  jest.mock('../../../../../app/storage/repos/download-blob')
  const { downloadBlob } = require('../../../../../app/storage/repos/download-blob')

  jest.mock('../../../../../app/api/ddi-index-api/export')
  const { createExportFile } = require('../../../../../app/api/ddi-index-api/export')

  beforeEach(async () => {
    const PassThrough = require('stream').PassThrough
    const stream = new PassThrough()
    downloadBlob.mockResolvedValue({ readableStreamBody: stream })
    stream.push('some dummy file content for testing')
    stream.push(null)
    exportAudit.mockResolvedValue()
  })

  test('GET /export route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/export',
      auth: adminAuth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /export route returns 302 if not auth', async () => {
    const options = {
      method: 'POST',
      url: '/export'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /export route returns 200 and calls exportAudit for admin user', async () => {
    const options = {
      method: 'POST',
      url: '/export',
      auth: adminAuth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(exportAudit.mock.calls[0]).toEqual([userWithDisplayname])
  })

  describe('GET /export-create-file', () => {
    test('returns 200 for admin user', async () => {
      const options = {
        method: 'GET',
        url: '/export-create-file',
        auth: adminAuth
      }

      createExportFile.mockReturnValue()

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
    })

    test('returns 302 if not auth', async () => {
      const options = {
        method: 'GET',
        url: '/export-create-file'
      }

      createExportFile.mockReturnValue()

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })

    test('returns 403 if standard user', async () => {
      const options = {
        method: 'GET',
        url: '/export-create-file',
        auth: standardAuth
      }

      createExportFile.mockReturnValue()

      const response = await server.inject(options)
      expect(response.statusCode).toBe(403)
    })
  })
})
