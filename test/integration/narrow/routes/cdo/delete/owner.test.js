const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const Boom = require('@hapi/boom')

describe('Delete Owner', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/person')
  const { getPersonByReference } = require('../../../../../../app/api/ddi-index-api/person')

  jest.mock('../../../../../../app/api/ddi-index-api/person')
  const { deletePerson } = require('../../../../../../app/api/ddi-index-api/person')

  const createServer = require('../../../../../../app/server')
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
  })

  describe('GET /cdo/delete/owner', () => {
    test('GET /cdo/delete/owner route returns 200 given standard', async () => {
      getPersonByReference.mockResolvedValue({
        id: 12345,
        personReference: 'P-12345',
        firstName: 'John',
        lastName: 'Smith'
      })

      const options = {
        method: 'GET',
        url: '/cdo/delete/owner/P-12345',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1').textContent.trim()).toBe('Are you sure you want to delete the owner record for John Smith?')
    })

    test('GET /cdo/delete/owner route returns 403 given standard user', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/delete/owner/P-12345',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })

    test('GET /cdo/delete/owner route returns 404 if no data found', async () => {
      getPersonByReference.mockRejectedValue(new Boom.Boom('Not found', { statusCode: 404 }))

      const options = {
        method: 'GET',
        url: '/cdo/delete/owner/P-12345',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })

    describe('POST /cdo/delete/owner', () => {
      test('POST /cdo/delete/owner route returns 200 with valid payload', async () => {
        getPersonByReference.mockResolvedValue({
          id: 12345,
          personReference: 'P-12345',
          firstName: 'John',
          lastName: 'Smith'
        })

        deletePerson.mockResolvedValue()

        const payload = {
          pk: 'P-12345',
          confirm: 'Y'
        }

        const options = {
          method: 'POST',
          url: '/cdo/delete/owner',
          auth,
          payload
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(200)
        expect(deletePerson).toHaveBeenCalledTimes(1)

        const { document } = (new JSDOM(response.payload)).window
        expect(document.querySelector('.govuk-panel__title').textContent.trim()).toBe('Owner record deleted')
        expect(document.querySelector('.govuk-panel__body').textContent.trim()).toBe('John Smith')
      })

      test('POST /cdo/delete/owner route returns 400 when payload is invalid', async () => {
        const options = {
          method: 'POST',
          url: '/cdo/delete/owner',
          auth,
          payload: {}
        }

        const response = await server.inject(options)

        const { document } = (new JSDOM(response.payload)).window

        expect(response.statusCode).toBe(400)
        expect(deletePerson).not.toHaveBeenCalled()
        expect(document.querySelector('.govuk-error-summary')).not.toBeNull()
      })

      test('POST /cdo/delete/owner route returns 302 when radio option No is selected', async () => {
        getPersonByReference.mockResolvedValue({
          id: 12345,
          personReference: 'P-12345',
          firstName: 'John',
          lastName: 'Smith'
        })

        deletePerson.mockResolvedValue()

        const payload = {
          pk: 'P-12345',
          confirm: 'N'
        }

        const options = {
          method: 'POST',
          url: '/cdo/delete/owner',
          auth,
          payload
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(302)
        expect(deletePerson).toHaveBeenCalledTimes(0)
      })
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })
})
