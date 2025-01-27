const { auth, user, userWithDisplayname } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const { buildCdo, buildCdoDog, buildCdoPerson, buildCdoPersonContact, buildCdoPersonContactContact } = require('../../../../../mocks/cdo/cdo')

describe('Send certificate', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  jest.mock('../../../../../../app/messaging/outbound/certificate-request')
  const { sendMessage } = require('../../../../../../app/messaging/outbound/certificate-request')

  jest.mock('../../../../../../app/routes/cdo/manage/tasks/issue-cert')
  const { issueCertTask } = require('../../../../../../app/routes/cdo/manage/tasks/issue-cert')

  jest.mock('../../../../../../app/storage/repos/certificate')
  const { downloadCertificate } = require('../../../../../../app/storage/repos/certificate')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/edit/send-certificate', () => {
    test('returns 200 for first certificate', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Interim exempt',
          indexNumber: 'ED12345'
        },
        person: {
          person_contacts: [{
            contact_id: 1,
            id: 1,
            person_id: 2,
            contact: {
              contact_type: {
                id: 1,
                contact_type: 'Email'
              },
              contact_type_id: 1,
              id: 1,
              contact: 'bilbo.baggins@shire.co.uk'
            }
          }]
        }
      })

      const options = {
        method: 'GET',
        url: '/cdo/edit/send-certificate/ED12345/first',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('.govuk-radios__label')[0].textContent.trim()).toBe('Email it to:bilbo.baggins@shire.co.uk')
      expect(document.querySelectorAll('.govuk-radios__label')[1].textContent.trim()).toBe('Post it')
    })

    test('returns 200 for first certificate when no email exists', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Interim exempt',
          indexNumber: 'ED12345'
        },
        person: {
          person_contacts: []
        }
      })

      const options = {
        method: 'GET',
        url: '/cdo/edit/send-certificate/ED12345/first',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('.govuk-radios__label')[0].textContent.trim()).toBe('Email')
      expect(document.querySelector('.govuk-radios__conditional').textContent.trim()).toBe('Email address              Enter the dog owner’s email address.')
    })

    test('returns 404 when dog not found', async () => {
      getCdo.mockResolvedValue(null)

      const options = {
        method: 'GET',
        url: '/cdo/edit/send-certificate/ED12345/first',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })
  })

  describe('POST /cdo/edit/send-certificate', () => {
    test('route returns 302 and sends first certificate email', async () => {
      getCdo.mockResolvedValue(buildCdo({
        dog: buildCdoDog({
          status: 'Interim exempt',
          indexNumber: 'ED12345'
        }),
        person: buildCdoPerson({
          person_contacts: [buildCdoPersonContact({
            contact_id: 1,
            id: 1,
            person_id: 2,
            contact: buildCdoPersonContactContact({
              contact_type: {
                id: 1,
                contact_type: 'Email'
              },
              contact_type_id: 1,
              id: 1,
              contact: 'bilbo.baggins@shire.co.uk'
            })
          })]
        })
      }))

      sendMessage.mockResolvedValue('certguid')
      downloadCertificate.mockResolvedValue()
      issueCertTask.mockResolvedValue()

      const payload = {
        indexNumber: 'ED12345',
        sendOption: 'email'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/send-certificate/ED12345/first',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(issueCertTask).toHaveBeenCalledWith(
        'ED12345',
        userWithDisplayname,
        {
          certificateId: 'certguid',
          email: 'bilbo.baggins@shire.co.uk',
          firstCertificate: true,
          sendOption: 'email'
        }
      )
    })

    test('route returns 302 and sends first certificate and updates email', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Interim exempt',
          indexNumber: 'ED12345'
        },
        person: {
          person_contacts: []
        }
      })

      sendMessage.mockResolvedValue('certguid')
      downloadCertificate.mockResolvedValue()
      issueCertTask.mockResolvedValue()

      const payload = {
        indexNumber: 'ED12345',
        sendOption: 'email',
        email: 'garrymcfadyen@hotmail.com',
        updateEmail: 'true'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/send-certificate/ED12345/first',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(issueCertTask).toHaveBeenCalledWith(
        'ED12345',
        userWithDisplayname,
        {
          certificateId: 'certguid',
          email: 'garrymcfadyen@hotmail.com',
          firstCertificate: true,
          sendOption: 'email',
          updateEmail: true
        }
      )
    })

    test('route returns 302 and sends replacement certificate email', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Interim exempt',
          indexNumber: 'ED12345'
        },
        person: {
          person_contacts: [{
            contact_id: 1,
            id: 1,
            person_id: 2,
            contact: {
              contact_type: {
                id: 1,
                contact_type: 'Email'
              },
              contact_type_id: 1,
              id: 1,
              contact: 'bilbo.baggins@shire.co.uk'
            }
          }]
        }
      })

      sendMessage.mockResolvedValue('certguid')
      downloadCertificate.mockResolvedValue()
      issueCertTask.mockResolvedValue()

      const payload = {
        indexNumber: 'ED12345',
        sendOption: 'email'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/send-certificate/ED12345/replacement',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(issueCertTask).toHaveBeenCalledWith(
        'ED12345',
        userWithDisplayname,
        {
          certificateId: 'certguid',
          email: 'bilbo.baggins@shire.co.uk',
          firstCertificate: false,
          sendOption: 'email'
        }
      )
    })

    test('route returns 302 and sends replacement certificate by post', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Interim exempt',
          indexNumber: 'ED12345'
        },
        person: {
          person_contacts: [{
            contact_id: 1,
            id: 1,
            person_id: 2,
            contact: {
              contact_type: {
                id: 1,
                contact_type: 'Email'
              },
              contact_type_id: 1,
              id: 1,
              contact: 'bilbo.baggins@shire.co.uk'
            }
          }]
        }
      })

      sendMessage.mockResolvedValue('certguid')
      downloadCertificate.mockResolvedValue()
      issueCertTask.mockResolvedValue()

      const payload = {
        indexNumber: 'ED12345',
        sendOption: 'post'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/send-certificate/ED12345/replacement',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(issueCertTask).not.toHaveBeenCalled()
      expect(response.headers.location).toBe('/cdo/edit/send-certificate-confirmation/ED12345/post/replacement')
    })

    test('route returns 400 if invalid payload', async () => {
      getCdo.mockResolvedValue(buildCdo({
        dog: buildCdoDog({
          status: 'Interim exempt',
          indexNumber: 'ED12345'
        }),
        person: buildCdoPerson({
          person_contacts: []
        })
      }))

      const payload = {
        indexNumber: 'ED12345',
        sendOption: 'email',
        email: '',
        updateEmail: 'true'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/send-certificate/ED12345/first',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(400)
    })

    test('route returns 404 if invalid dog', async () => {
      getCdo.mockResolvedValue()

      sendMessage.mockResolvedValue('certguid')
      downloadCertificate.mockResolvedValue()
      issueCertTask.mockResolvedValue()

      const payload = {
        indexNumber: 'ED12345',
        sendOption: 'email'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/send-certificate/ED12345/first',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })

    test('route displays error if error sending email', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Interim exempt',
          indexNumber: 'ED12345'
        },
        person: {
          person_contacts: [{
            contact_id: 1,
            id: 1,
            person_id: 2,
            contact: {
              contact_type: {
                id: 1,
                contact_type: 'Email'
              },
              contact_type_id: 1,
              id: 1,
              contact: 'bilbo.baggins@shire.co.uk'
            }
          }]
        }
      })

      sendMessage.mockResolvedValue('certguid')
      downloadCertificate.mockResolvedValue()
      issueCertTask.mockResolvedValue({
        details: [
          {
            message: 'Error in back-end',
            path: ['anyField']
          }
        ]
      })

      const payload = {
        indexNumber: 'ED12345',
        sendOption: 'email'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/send-certificate/ED12345/first',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)
      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('.govuk-error-message')[0].textContent.trim()).toBe('Error: Error in back-end')
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
