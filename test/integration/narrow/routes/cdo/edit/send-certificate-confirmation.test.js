const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Send certificate confirmation', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  jest.mock('../../../../../../app/lib/back-helpers')
  const { getMainReturnPoint } = require('../../../../../../app/lib/back-helpers')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    getMainReturnPoint.mockReturnValue('/return-point')
    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/edit/send-certificate-confirmation', () => {
    test('returns 200 for first certificate by email', async () => {
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
        url: '/cdo/edit/send-certificate-confirmation/ED12345/email/first',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('.govuk-panel__title')[0].textContent.trim()).toBe('Email with the certificate sent')
      expect(document.querySelectorAll('.govuk-panel__body')[0].textContent.trim()).toBe('Dog ED12345 is now exempt')
    })

    test('returns 200 for replacement certificate by email', async () => {
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
        url: '/cdo/edit/send-certificate-confirmation/ED12345/email/replacement',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('.govuk-panel__title')[0].textContent.trim()).toBe('Replacement certificate has been sent by email')
      expect(document.querySelectorAll('.govuk-panel__body')[0].textContent.trim()).toBe('Dog ED12345')
    })

    test('returns 200 for first certificate by post', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Interim exempt',
          indexNumber: 'ED12345'
        },
        person: {
          firstName: 'John',
          lastName: 'Smith',
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
        url: '/cdo/edit/send-certificate-confirmation/ED12345/post/first',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('main .govuk-heading-l')[0].textContent.trim()).toBe('Generate a certificate of exemption to post')
      expect(document.querySelectorAll('main p')[0].textContent.trim()).toContain('John Smith')
      expect(document.querySelectorAll('main .govuk-button-group a')[0].href).toBe('/cdo/manage/cdo/ED12345')
    })

    test('returns 200 for replacement certificate by post', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Interim exempt',
          indexNumber: 'ED12345'
        },
        person: {
          firstName: 'John',
          lastName: 'Smith',
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
        url: '/cdo/edit/send-certificate-confirmation/ED12345/post/replacement',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('main .govuk-heading-l')[0].textContent.trim()).toBe('Generate a replacement certificate of exemption to post')
      expect(document.querySelectorAll('main p')[0].textContent.trim()).toContain('John Smith')
    })

    test('returns 404 when dog not found', async () => {
      getCdo.mockResolvedValue(null)

      const options = {
        method: 'GET',
        url: '/cdo/edit/send-certificate-confirmation/ED12345/email/first',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
