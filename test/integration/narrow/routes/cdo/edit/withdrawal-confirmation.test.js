const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Withdrawal confirmation', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/edit/withdrawal-confirmation', () => {
    test('route returns 200 for email', async () => {
      getCdo.mockResolvedValue({
        dog: {
          indexNumber: 'ED12345'
        },
        person: {
          person_contacts: [
            { contact: { id: 1, contact: 'adam.smith@testmail.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } }
          ]
        }
      })

      const options = {
        method: 'GET',
        url: '/cdo/edit/withdrawal-confirmation/ED12345/email',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('.govuk-panel')[0].textContent.trim()).toContain('Dog ED12345 withdrawn')
      expect(document.querySelectorAll('.govuk-panel')[0].textContent.trim()).toContain('Confirmation email sent')
      expect(document.querySelectorAll('main p')[0].textContent).toContain('An email confirming the withdrawal has been sent to adam.smith@testmail.com.')
    })

    test('route returns 200 for postal', async () => {
      getCdo.mockResolvedValue({
        dog: {
          indexNumber: 'ED12345'
        },
        person: {
          person_contacts: [
            { contact: { id: 1, contact: 'adam.smith@testmail.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } }
          ],
          addresses: [
            { address: { id: 1, address_line_1: 'addr1', address_line_2: 'addr2', town: 'town', postcode: 'postcode' } }
          ],
          firstName: 'Adam',
          lastName: 'Smith'
        }
      })

      const options = {
        method: 'GET',
        url: '/cdo/edit/withdrawal-confirmation/ED12345/post',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('h1')[0].textContent.trim()).toBe('Dog ED12345 withdrawn')
      expect(document.querySelectorAll('main h2')[0].textContent.trim()).toBe('Send the owner a letter confirming the withdrawal')
      expect(document.querySelectorAll('main p')[0].textContent).toContain('Adam Smith')
      expect(document.querySelectorAll('main p')[0].textContent).toContain('addr1')
      expect(document.querySelectorAll('main p')[0].textContent).toContain('addr2')
      expect(document.querySelectorAll('main p')[0].textContent).toContain('town')
      expect(document.querySelectorAll('main p')[0].textContent).toContain('postcode')
    })

    test('route returns 404 when dog not found', async () => {
      getCdo.mockResolvedValue(null)

      const options = {
        method: 'GET',
        url: '/cdo/edit/withdrawal-confirmation/ED12345/email',
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
