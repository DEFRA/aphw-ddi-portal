const Joi = require('joi')
const { JSDOM } = require('jsdom')
const { admin } = require('../../../../../../app/auth/permissions')

describe('View certificate', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/auth/get-user')
  const getUser = require('../../../../../../app/auth/get-user')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo, getManageCdoDetails } = require('../../../../../../app/api/ddi-index-api/cdo')

  jest.mock('../../../../../../app/messaging/outbound/certificate-request')

  jest.mock('../../../../../../app/storage/repos/certificate')
  const { downloadCertificate } = require('../../../../../../app/storage/repos/certificate')

  jest.mock('../../../../../../app/messaging/outbound/certificate-request')
  const { sendMessage } = require('../../../../../../app/messaging/outbound/certificate-request')

  jest.mock('../../../../../../app/routes/cdo/manage/tasks/issue-cert')
  const { issueCertTask } = require('../../../../../../app/routes/cdo/manage/tasks/issue-cert')

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
      issueCertTask.mockResolvedValue()
      getManageCdoDetails.mockResolvedValue({ tasks: { certificateIssued: { available: true } } })

      const options = {
        method: 'POST',
        url: '/cdo/view/certificate',
        auth,
        payload: {
          indexNumber: 'ED123',
          firstCertificate: true
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)
      expect(issueCertTask).not.toHaveBeenCalled()
      expect(response.headers['content-type']).toBe('application/pdf')
    })

    test('POST /cdo/view/certificate calls issueCertTask for Pre-exempt', async () => {
      getCdo.mockResolvedValue({ dog: { indexNumber: 'ED123', status: 'Pre-exempt' } })
      downloadCertificate.mockResolvedValue('certificate')
      sendMessage.mockResolvedValue(12345)
      issueCertTask.mockResolvedValue()
      getManageCdoDetails.mockResolvedValue({ tasks: { certificateIssued: { available: true } } })

      const options = {
        method: 'POST',
        url: '/cdo/view/certificate',
        auth,
        payload: {
          indexNumber: 'ED123',
          firstCertificate: true
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)
      expect(issueCertTask).toHaveBeenCalled()
      expect(response.headers['content-type']).toBe('application/pdf')
    })

    test('POST /cdo/view/certificate calls issueCertTask for Failed', async () => {
      getCdo.mockResolvedValue({ dog: { indexNumber: 'ED123', status: 'Failed' } })
      downloadCertificate.mockResolvedValue('certificate')
      sendMessage.mockResolvedValue(12345)
      issueCertTask.mockResolvedValue()
      getManageCdoDetails.mockResolvedValue({ tasks: { certificateIssued: { available: true } } })

      const options = {
        method: 'POST',
        url: '/cdo/view/certificate',
        auth,
        payload: {
          indexNumber: 'ED123',
          firstCertificate: true
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)
      expect(issueCertTask).toHaveBeenCalled()
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
      issueCertTask.mockResolvedValue()
      getManageCdoDetails.mockResolvedValue({ tasks: { certificateIssued: { available: true } } })

      const options = {
        method: 'POST',
        url: '/cdo/view/certificate',
        auth,
        payload: {
          indexNumber: 'ED123',
          firstCertificate: true
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toBe('application/pdf')
      expect(response.headers['content-disposition']).toBe('filename="123 - Rex - Certificate of Exemption XL Bully.pdf"')
    })

    test('POST /cdo/view/certificate route returns 404 given no cdo exists', async () => {
      getCdo.mockResolvedValue(undefined)
      issueCertTask.mockResolvedValue()
      getManageCdoDetails.mockResolvedValue({ tasks: { certificateIssued: { available: true } } })

      const options = {
        method: 'POST',
        url: '/cdo/view/certificate',
        auth,
        payload: {
          indexNumber: 'ED123',
          firstCertificate: true
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
      issueCertTask.mockResolvedValue()
      getManageCdoDetails.mockResolvedValue({ tasks: { certificateIssued: { available: true } } })

      const options = {
        method: 'POST',
        url: '/cdo/view/certificate',
        auth,
        payload: {
          indexNumber: 'ED123',
          firstCertificate: true
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })

    test('POST /cdo/view/certificate route returns 500 given server error', async () => {
      getCdo.mockResolvedValue({ dog: { indexNumber: 'ED123' } })
      downloadCertificate.mockRejectedValue(new Error('server error'))
      sendMessage.mockResolvedValue(12345)
      issueCertTask.mockResolvedValue()
      getManageCdoDetails.mockResolvedValue({ tasks: { certificateIssued: { available: true } } })

      const options = {
        method: 'POST',
        url: '/cdo/view/certificate',
        auth,
        payload: {
          indexNumber: 'ED123',
          firstCertificate: true
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(500)
    })

    test('POST /cdo/view/certificate route returns 200 when calling issueCertTask for pre-exempt', async () => {
      getCdo.mockResolvedValue({ dog: { indexNumber: 'ED123' } })
      downloadCertificate.mockResolvedValue('certificate')
      sendMessage.mockResolvedValue(12345)
      issueCertTask.mockResolvedValue()
      getManageCdoDetails.mockResolvedValue({ tasks: { certificateIssued: { completed: true } }, cdo: { dog: { status: 'Pre-exempt' } } })

      const options = {
        method: 'POST',
        url: '/cdo/view/certificate',
        auth,
        payload: {
          indexNumber: 'ED123',
          firstCertificate: true
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)
      expect(issueCertTask).not.toHaveBeenCalled()
      expect(response.headers['content-type']).toBe('application/pdf')
    })

    test('POST /cdo/view/certificate route returns 200 when calling issueCertTask for failed', async () => {
      getCdo.mockResolvedValue({ dog: { indexNumber: 'ED123' } })
      downloadCertificate.mockResolvedValue('certificate')
      sendMessage.mockResolvedValue(12345)
      issueCertTask.mockResolvedValue()
      getManageCdoDetails.mockResolvedValue({ tasks: { certificateIssued: { completed: true } }, cdo: { dog: { status: 'Failed' } } })

      const options = {
        method: 'POST',
        url: '/cdo/view/certificate',
        auth,
        payload: {
          indexNumber: 'ED123',
          firstCertificate: true
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)
      expect(issueCertTask).not.toHaveBeenCalled()
      expect(response.headers['content-type']).toBe('application/pdf')
    })

    test('POST /cdo/view/certificate route returns errors to page when error occurs in issueCertTask', async () => {
      const message = 'Test error text'
      getCdo.mockResolvedValue({ dog: { indexNumber: 'ED123', status: 'Pre-exempt' } })
      downloadCertificate.mockResolvedValue('certificate')
      sendMessage.mockResolvedValue(12345)
      issueCertTask.mockResolvedValue(new Joi.ValidationError(message, [{ message, path: ['generalError'], type: 'custom' }]))
      getManageCdoDetails.mockResolvedValue({ tasks: { certificateIssued: { completed: true } }, cdo: { dog: { status: 'Pre-exempt' } } })

      const options = {
        method: 'POST',
        url: '/cdo/view/certificate',
        auth,
        payload: {
          indexNumber: 'ED123',
          firstCertificate: true
        }
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      const errorBody = document.querySelector('.govuk-error-summary__body')
      expect(errorBody.querySelectorAll('ul li')[0].textContent.trim()).toBe('Test error text')
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
