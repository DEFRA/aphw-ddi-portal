const { admin } = require('../../../../../../app/auth/permissions')

describe('View certificate', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/auth/get-user')
  const getUser = require('../../../../../../app/auth/get-user')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  jest.mock('../../../../../../app/messaging/outbound/certificate-request')

  jest.mock('../../../../../../app/storage/repos/certificate')
  const { downloadCertificate } = require('../../../../../../app/storage/repos/certificate')

  jest.mock('../../../../../../app/messaging/outbound/certificate-request')
  const { sendMessage } = require('../../../../../../app/messaging/outbound/certificate-request')

  const createServer = require('../../../../../../app/server')
  let server

  const auth = { strategy: 'session-auth', credentials: { scope: [admin] } }

  const user = {
    displayname: 'Dev User',
    username: 'dev@example.com'
  }

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/view/certificate', () => {
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
  })

  describe('POST /cdo/view/certificate', () => {
    test('POST /cdo/view/certificate route returns 200', async () => {
      getCdo.mockResolvedValue({ dog: { indexNumber: 'ED123' } })
      downloadCertificate.mockResolvedValue('certificate')
      sendMessage.mockResolvedValue(12345)

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

    test('POST /cdo/view/certificate route returns 200 given exemption order 2023', async () => {
      getCdo.mockResolvedValue({
        dog: { indexNumber: 'ED123', id: 123, name: 'Rex' },
        exemption: {
          exemptionOrder: '2023'
        }
      })
      downloadCertificate.mockResolvedValue('certificate')
      sendMessage.mockResolvedValue(12345)

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
      expect(response.headers['content-disposition']).toBe('filename="123 - Rex - Certificate of Exemption XL Bully.pdf"')
    })

    test('POST /cdo/view/certificate route returns 404 given no cdo exists', async () => {
      getCdo.mockResolvedValue(undefined)

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

    test('POST /cdo/view/certificate route returns 400 given invalid payload', async () => {
      const options = {
        method: 'POST',
        url: '/cdo/view/certificate',
        auth,
        payload: {}
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(400)
    })

    test('POST /cdo/view/certificate route returns 404 when certificate not found', async () => {
      getCdo.mockResolvedValue({ dog: { indexNumber: 'ED123' } })
      downloadCertificate.mockRejectedValue({ type: 'CertificateNotFound' })
      sendMessage.mockResolvedValue(12345)

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

    test('POST /cdo/view/certificate route returns 500 given server error', async () => {
      getCdo.mockResolvedValue({ dog: { indexNumber: 'ED123' } })
      downloadCertificate.mockRejectedValue(new Error('server error'))
      sendMessage.mockResolvedValue(12345)

      const options = {
        method: 'POST',
        url: '/cdo/view/certificate',
        auth,
        payload: {
          indexNumber: 'ED123'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(500)
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
