const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const { ApiConflictError } = require('../../../../../../app/errors/api-conflict-error')
const { ApiErrorFailure } = require('../../../../../../app/errors/api-error-failure')

describe('Update dog details', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/dog-breeds')
  const { getBreeds } = require('../../../../../../app/api/ddi-index-api/dog-breeds')

  jest.mock('../../../../../../app/api/ddi-index-api/dog')
  const { getDogDetails, updateDogDetails } = require('../../../../../../app/api/ddi-index-api/dog')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    getBreeds.mockResolvedValue({
      breeds: [
        { breed: 'breed1' },
        { breed: 'breed2' },
        { breed: 'breed3' }
      ]
    })

    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/edit/dog-details/P-1234-5678', () => {
    test('GET /cdo/edit/dog-details/P-1234-5678 route returns 200', async () => {
      getDogDetails.mockResolvedValue({
        name: 'Bruno',
        dog_breed: { breed: 'breed1' }
      })

      const options = {
        method: 'GET',
        url: '/cdo/edit/dog-details/P-1234-5678',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)
    })

    test('GET /cdo/edit/dog-details/P-1234-5678 route returns 404 when dog not found', async () => {
      getDogDetails.mockResolvedValue(null)

      const options = {
        method: 'GET',
        url: '/cdo/edit/dog-details/P-1234-5678',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })
  })

  describe('POST /cdo/edit/dog-details', () => {
    test('POST /cdo/edit/dog-details route returns 302', async () => {
      updateDogDetails.mockResolvedValue()
      const payload = {
        id: 1,
        indexNumber: 'ED123',
        name: 'Bruno',
        breed: 'breed1'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/dog-details',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(updateDogDetails).toHaveBeenCalledTimes(1)
    })

    test('POST /cdo/edit/dog-details route returns 400 when payload is invalid', async () => {
      updateDogDetails.mockResolvedValue()
      const options = {
        method: 'POST',
        url: '/cdo/edit/dog-details',
        auth,
        payload: {}
      }

      const response = await server.inject(options)

      const { document } = (new JSDOM(response.payload)).window

      expect(response.statusCode).toBe(400)
      expect(updateDogDetails).not.toHaveBeenCalled()
      expect(document.querySelector('.govuk-error-summary')).not.toBeNull()
    })

    test('POST /cdo/edit/dog-details with invalid date of birth returns 400', async () => {
      updateDogDetails.mockResolvedValue()
      const payload = {
        id: 1,
        indexNumber: 'ED123',
        name: 'Bruno',
        breed: 'breed1',
        'dateOfBirth-day': '40',
        'dateOfBirth-month': '1',
        'dateOfBirth-year': '1980'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/dog-details',
        auth,
        payload
      }

      const response = await server.inject(options)

      const { document } = (new JSDOM(response.payload)).window

      expect(response.statusCode).toBe(400)
      expect(updateDogDetails).not.toHaveBeenCalled()
      expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

      const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

      expect(messages).toContain('Enter a real date')
    })

    test('POST /cdo/edit/dog-details with missing month and year returns 400', async () => {
      updateDogDetails.mockResolvedValue()
      const payload = {
        id: 1,
        indexNumber: 'ED123',
        name: 'Bruno',
        breed: 'breed1',
        'dateOfBirth-day': '1',
        'dateOfBirth-month': '',
        'dateOfBirth-year': ''
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/dog-details',
        auth,
        payload
      }

      const response = await server.inject(options)

      const { document } = (new JSDOM(response.payload)).window

      expect(response.statusCode).toBe(400)
      expect(updateDogDetails).not.toHaveBeenCalled()
      expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

      const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
      expect(messages).toContain('A date must include a month and year')
    })

    test('POST /cdo/edit/dog-details with short year returns 400', async () => {
      updateDogDetails.mockResolvedValue()
      const payload = {
        id: 1,
        indexNumber: 'ED123',
        name: 'Bruno',
        breed: 'breed1',
        'dateOfBirth-day': '1',
        'dateOfBirth-month': '2',
        'dateOfBirth-year': '26'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/dog-details',
        auth,
        payload
      }

      const response = await server.inject(options)

      const { document } = (new JSDOM(response.payload)).window

      expect(response.statusCode).toBe(400)
      expect(updateDogDetails).not.toHaveBeenCalled()
      expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

      const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
      expect(messages).toContain('Enter a 4-digit year')
    })

    test('POST /cdo/edit/dog-details with duplicate microchip returns 400 given duplicate microchip 1', async () => {
      updateDogDetails.mockRejectedValue(new ApiConflictError(new ApiErrorFailure('409 Conflict', {
        statusCode: 409,
        statusMessage: 'The microchip number already exists',
        payload: {
          statusCode: 409,
          error: 'Conflict',
          message: 'The microchip number already exists',
          microchipNumbers: [
            '875257109325923'
          ]
        }
      })))

      const payload = {
        id: 1,
        indexNumber: 'ED123',
        name: 'Bruno',
        breed: 'breed1',
        microchipNumber: '875257109325923'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/dog-details',
        auth,
        payload
      }

      const response = await server.inject(options)

      const { document } = (new JSDOM(response.payload)).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

      const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
      expect(messages).toContain('The microchip number already exists')
      expect(document.querySelector('#microchipNumber-error')).not.toBeNull()
    })
    test('POST /cdo/edit/dog-details with duplicate microchip returns 400 given duplicate microchip 2', async () => {
      updateDogDetails.mockRejectedValue(new ApiConflictError(new ApiErrorFailure('409 Conflict', {
        statusCode: 409,
        statusMessage: 'The microchip number already exists',
        payload: {
          statusCode: 409,
          error: 'Conflict',
          message: 'The microchip number already exists',
          microchipNumbers: [
            '875257109325923'
          ]
        }
      })))

      const payload = {
        id: 1,
        indexNumber: 'ED123',
        name: 'Bruno',
        breed: 'breed1',
        microchipNumber: '111111716196581',
        microchipNumber2: '875257109325923'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/dog-details',
        auth,
        payload
      }

      const response = await server.inject(options)

      const { document } = (new JSDOM(response.payload)).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

      const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
      expect(messages).toContain('The microchip number already exists')
      expect(document.querySelector('#microchipNumber-error')).toBeNull()
      expect(document.querySelector('#microchipNumber2-error')).not.toBeNull()
    })
    test('POST /cdo/edit/dog-details with duplicate microchip returns 400 given duplicate microchip 1 & 2', async () => {
      updateDogDetails.mockRejectedValue(new ApiConflictError(new ApiErrorFailure('409 Conflict', {
        statusCode: 409,
        statusMessage: 'The microchip number already exists',
        payload: {
          statusCode: 409,
          error: 'Conflict',
          message: 'The microchip number already exists',
          microchipNumbers: [
            '111111716196581',
            '875257109325923'
          ]
        }
      })))

      const payload = {
        id: 1,
        indexNumber: 'ED123',
        name: 'Bruno',
        breed: 'breed1',
        microchipNumber: '111111716196581',
        microchipNumber2: '875257109325923'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/dog-details',
        auth,
        payload
      }

      const response = await server.inject(options)

      const { document } = (new JSDOM(response.payload)).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

      const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
      expect(messages).toContain('The microchip number already exists')
      expect(messages.length).toBe(2)
      expect(document.querySelector('#microchipNumber-error')).not.toBeNull()
      expect(document.querySelector('#microchipNumber2-error')).not.toBeNull()
    })

    test('POST /cdo/edit/dog-details with invalid microchip returns 302 original microchip', async () => {
      updateDogDetails.mockResolvedValue()
      const payload = {
        id: 1,
        indexNumber: 'ED123',
        name: 'Bruno',
        breed: 'breed1',
        microchipNumber: '12345',
        origMicrochipNumber: 'ua12345',
        'dateOfBirth-day': '1',
        'dateOfBirth-month': '1',
        'dateOfBirth-year': '1980'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/dog-details',
        auth,
        payload
      }

      const response = await server.inject(options)

      const { document } = (new JSDOM(response.payload)).window

      expect(response.statusCode).toBe(302)
      expect(updateDogDetails).toHaveBeenCalled()
      expect(document.querySelector('.govuk-error-summary')).toBeNull()
    })

    test('POST /cdo/edit/dog-details with no change to microchip returns 302 original microchip was old format', async () => {
      updateDogDetails.mockResolvedValue()
      const payload = {
        id: 1,
        indexNumber: 'ED123',
        name: 'Bruno',
        breed: 'breed1',
        microchipNumber: 'ua12345',
        origMicrochipNumber: 'ua12345',
        'dateOfBirth-day': '1',
        'dateOfBirth-month': '1',
        'dateOfBirth-year': '1980'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/dog-details',
        auth,
        payload
      }

      const response = await server.inject(options)

      const { document } = (new JSDOM(response.payload)).window

      expect(updateDogDetails).toHaveBeenCalled()
      expect(document.querySelector('.govuk-error-summary')).toBeNull()
      expect(response.statusCode).toBe(302)
    })
  })
  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
