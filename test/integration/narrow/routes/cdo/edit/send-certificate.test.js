const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const { routes } = require('../../../../../../app/constants/cdo/dog')

describe('Send certificate', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  jest.mock('../../../../../../app/api/ddi-index-api/dog')
  const { updateStatus } = require('../../../../../../app/api/ddi-index-api/dog')

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
      expect(document.querySelectorAll('.govuk-radios__label')[0].textContent.trim()).toBe('Email it to: bilbo.baggins@shire.co.uk')
      expect(document.querySelectorAll('.govuk-radios__label')[1].textContent.trim()).toBe('Post it')
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

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
