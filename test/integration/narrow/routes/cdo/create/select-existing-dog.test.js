const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const FormData = require('form-data')
const { routes } = require('../../../../../../app/constants/cdo/dog')

describe('SelectExistingDog test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/cdo/owner')
  const { getOwnerDetails } = require('../../../../../../app/session/cdo/owner')

  jest.mock('../../../../../../app/session/cdo/dog')
  const { getExistingDogs, setDog } = require('../../../../../../app/session/cdo/dog')

  const mockDogs = [
    {
      name: 'Fido',
      breed: 'Breed 1',
      dogId: 1,
      indexNumber: 'ED123',
      microchipNumber: '12345'
    }, {
      name: 'Buster',
      breed: 'Breed 2',
      dogId: 2,
      indexNumber: 'ED234',
      microchipNumber: '67890'
    }, {
      name: 'Bruno',
      breed: 'Breed 3',
      dogId: 3,
      indexNumber: 'ED789'
    }
  ]

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/create/select-existing-dog', () => {
    test('route returns 200', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/create/select-existing-dog',
        auth
      }

      getExistingDogs.mockReturnValue(mockDogs)
      getOwnerDetails.mockReturnValue({
        firstName: 'John',
        lastName: 'Smith'
      })

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)

      const { document } = new JSDOM(response.payload).window

      expect(getOwnerDetails).toBeCalledTimes(1)
      expect(document.querySelector('h1').textContent).toBe('Select the dog for John Smith')
      expect(document.querySelectorAll('form .govuk-radios__item label')[0].textContent.trim()).toContain('FidoBreed: Breed 1Index number: ED123Microchip number: 12345')
      expect(document.querySelectorAll('form .govuk-radios__item .govuk-radios__input')[0].getAttribute('value')).toBe('0')
      expect(document.querySelectorAll('form .govuk-radios__item label')[1].textContent.trim()).toContain('BusterBreed: Breed 2Index number: ED234Microchip number: 67890')
      expect(document.querySelectorAll('form .govuk-radios__item .govuk-radios__input')[1].getAttribute('value')).toBe('1')
      expect(document.querySelectorAll('form .govuk-radios__item label')[2].textContent.trim()).toContain('BrunoBreed: Breed 3Index number: ED789')
      expect(document.querySelectorAll('form .govuk-radios__item .govuk-radios__input')[2].getAttribute('value')).toBe('2')
      expect(document.querySelectorAll('form .govuk-radios__item label')[3].textContent.trim()).toContain('Add a new dog for this owner')
      expect(document.querySelectorAll('form .govuk-radios__item .govuk-radios__input')[3].getAttribute('value')).toBe('-1')
      expect(document.querySelector('.govuk-grid-row form .govuk-button').textContent.trim()).toBe('Continue')
    })
  })

  describe('POST /cdo/create/select-existing-dog', () => {
    test('route returns 302 if not auth', async () => {
      const fd = new FormData()

      const options = {
        method: 'POST',
        url: '/cdo/create/select-existing-dog',
        headers: fd.getHeaders(),
        payload: fd.getBuffer()
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })

    test('with empty data returns error', async () => {
      const options = {
        method: 'POST',
        url: '/cdo/create/select-existing-dog',
        auth,
        payload: {}
      }

      getExistingDogs.mockReturnValue(mockDogs)
      getOwnerDetails.mockReturnValue({
        firstName: 'John',
        lastName: 'Smith'
      })

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('.govuk-error-summary__list')).not.toBeNull()
      expect(document.querySelectorAll('.govuk-error-summary__list a').length).toBe(1)
      expect(document.querySelectorAll('.govuk-error-summary__list a')[0].textContent.trim()).toBe('Select an option')
      expect(document.querySelector('h1').textContent).toBe('Select the dog for John Smith')
    })

    test('with valid data and dog selected, forwards to applicationType', async () => {
      const options = {
        method: 'POST',
        url: '/cdo/create/select-existing-dog',
        auth,
        payload: { dog: '1' }
      }

      getExistingDogs.mockReturnValue(mockDogs)
      getOwnerDetails.mockReturnValue({
        firstName: 'John',
        lastName: 'Smith'
      })

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(setDog).toHaveBeenCalledWith(expect.anything(), {
        breed: 'Breed 2',
        dogId: 2,
        indexNumber: 'ED234',
        microchipNumber: '67890',
        name: 'Buster'
      })
      expect(response.headers.location).toBe(routes.applicationType.get)
    })

    test('with valid data and create new dog selected, forwards to microchip search', async () => {
      const options = {
        method: 'POST',
        url: '/cdo/create/select-existing-dog',
        auth,
        payload: { dog: '-1' }
      }

      getExistingDogs.mockReturnValue(mockDogs)
      getOwnerDetails.mockReturnValue({
        firstName: 'John',
        lastName: 'Smith'
      })

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(setDog).toHaveBeenCalledWith(expect.anything(), {})
      expect(response.headers.location).toBe(routes.microchipSearch.get)
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
