const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Withdraw', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  jest.mock('../../../../../../app/api/ddi-index-api/dog')
  const { withdrawDog } = require('../../../../../../app/api/ddi-index-api/dog')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/edit/withdraw', () => {
    test('route returns 200', async () => {
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
        url: '/cdo/edit/withdraw/ED12345',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('.govuk-radios__label')[0].textContent.trim()).toBe('Email confirmation to:adam.smith@testmail.com')
      expect(document.querySelectorAll('.govuk-radios__label')[1].textContent.trim()).toBe('Post confirmation')
    })

    test('route returns 200 whe no email exists', async () => {
      getCdo.mockResolvedValue({
        dog: {
          indexNumber: 'ED12345'
        },
        person: {
          person_contacts: [
            { contact: { id: 1, contact: '', contact_type_id: 2, contact_type: { contact_type: 'Email' } } }
          ]
        }
      })

      const options = {
        method: 'GET',
        url: '/cdo/edit/withdraw/ED12345',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('.govuk-radios__label')[0].textContent.trim()).toBe('Email confirmation')
      expect(document.querySelector('.govuk-radios__conditional').textContent.trim()).toBe('Email address              Enter the dog owner’s email address.')
    })

    test('route returns 404 when dog not found', async () => {
      getCdo.mockResolvedValue(null)

      const options = {
        method: 'GET',
        url: '/cdo/edit/withdraw/ED12345',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })
  })

  describe('POST /cdo/edit/withdraw', () => {
    test('route returns 302 if withdraw option is email', async () => {
      getCdo.mockResolvedValue({
        dog: {
          indexNumber: 'ED12345'
        }
      })
      withdrawDog.mockResolvedValue()

      const payload = {
        indexNumber: 'ED12345',
        withdrawOption: 'email'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/withdraw/ED12345',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(withdrawDog).toHaveBeenCalledWith({ indexNumber: 'ED12345', withdrawOption: 'email' }, expect.anything())
    })

    test('route returns 302 and updates email', async () => {
      getCdo.mockResolvedValue({
        dog: {
          indexNumber: 'ED12345'
        }
      })
      withdrawDog.mockResolvedValue()

      const payload = {
        indexNumber: 'ED12345',
        withdrawOption: 'email',
        email: 'garrymcfadyen@hotmail.com',
        updateEmail: 'true'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/withdraw/ED12345',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(withdrawDog).toHaveBeenCalledWith({ indexNumber: 'ED12345', withdrawOption: 'email', email: 'garrymcfadyen@hotmail.com', updateEmail: true }, expect.anything())
    })

    test('route returns 302 if withdraw option is post', async () => {
      getCdo.mockResolvedValue({
        dog: {
          indexNumber: 'ED12345'
        }
      })
      withdrawDog.mockResolvedValue()

      const payload = {
        indexNumber: 'ED12345',
        email: '',
        withdrawOption: 'post',
        updateEmail: true
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/withdraw/ED12345',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(withdrawDog).toHaveBeenCalledWith({ indexNumber: 'ED12345', withdrawOption: 'post' }, expect.anything())
    })

    test('route returns 400 with invalid schema', async () => {
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

      const payload = {
        withdrawOption: 'email',
        email: ''
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/withdraw/ED12345',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(400)
    })

    test('route returns 500 when DB exception', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Exempt',
          indexNumber: 'ED12345'
        }
      })
      withdrawDog.mockRejectedValue(new Error('server error'))

      const payload = {
        indexNumber: 'ED12345',
        newStatus: 'Inactive'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/withdraw/ED12345',
        auth,
        payload
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
