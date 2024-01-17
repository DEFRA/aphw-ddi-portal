const { admin } = require('../../../../../../app/auth/permissions')

describe('View certificate', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  jest.mock('../../../../../../app/messaging/outbound/certificate-request')

  jest.mock('../../../../../../app/storage/repos/certificate')
  const { downloadCertificate } = require('../../../../../../app/storage/repos/certificate')

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

  test('GET /cdo/view/certificate route returns 200', async () => {
    getCdo.mockResolvedValue({ dog: { indexNumber: 'ED123' } })

    const options = {
      method: 'GET',
      url: '/cdo/view/certificate/ED123',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/view/certificate route returns 404 when cdo not found', async () => {
    getCdo.mockResolvedValue(undefined)

    const options = {
      method: 'GET',
      url: '/cdo/view/certificate/ED123',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  test('POST /cdo/view/certificate route returns 200', async () => {
    getCdo.mockResolvedValue({ dog: { indexNumber: 'ED123' } })
    downloadCertificate.mockResolvedValue('certificate')

    const options = {
      method: 'POST',
      url: '/cdo/view/certificate',
      auth,
      payload: {
        indexNumber: 'ED123'
      }
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toBe('application/pdf')
  })

  test('POST /cdo/view/certificate route returns 404 when certificate not found', async () => {
    getCdo.mockResolvedValue({ dog: { indexNumber: 'ED123' } })
    downloadCertificate.mockRejectedValue({ type: 'CertificateNotFound' })

    const options = {
      method: 'POST',
      url: '/cdo/view/certificate',
      auth,
      payload: {
        indexNumber: 'ED123'
      }
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
