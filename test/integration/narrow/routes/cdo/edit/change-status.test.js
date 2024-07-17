const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const { ApiConflictError } = require('../../../../../../app/errors/api-conflict-error')
const { ApiErrorFailure } = require('../../../../../../app/errors/api-error-failure')
const { routes } = require('../../../../../../app/constants/cdo/dog')

describe('Change status', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  jest.mock('../../../../../../app/api/ddi-index-api/dog')
  const { updateStatus } = require('../../../../../../app/api/ddi-index-api/dog')

  jest.mock('../../../../../../app/api/ddi-index-api/dog-breaches')
  const { getBreachCategories, setDogBreaches } = require('../../../../../../app/api/ddi-index-api/dog-breaches')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/edit/change-status', () => {
    test('GET /cdo/edit/change-status route returns 200', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Exempt',
          indexNumber: 'ED12345'
        }
      })

      const options = {
        method: 'GET',
        url: '/cdo/edit/change-status/ED12345',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)
    })

    test('GET /cdo/edit/change-status route returns 404 when dog not found', async () => {
      getCdo.mockResolvedValue(null)

      const options = {
        method: 'GET',
        url: '/cdo/edit/change-status/ED12345',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })
  })

  describe('POST /cdo/edit/change-status', () => {
    test('POST /cdo/edit/change-status route returns 302', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Exempt',
          indexNumber: 'ED12345'
        }
      })

      updateStatus.mockResolvedValue()

      const payload = {
        indexNumber: 'ED12345',
        newStatus: 'Inactive'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/change-status',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(updateStatus).toHaveBeenCalledTimes(1)
    })

    test('POST /cdo/edit/change-status route returns 302 given status is In breach', async () => {
      const nextScreenUrl = routes.inBreach.get

      getCdo.mockResolvedValue({
        dog: {
          status: 'Exempt',
          indexNumber: 'ED12345'
        }
      })

      updateStatus.mockResolvedValue()

      const payload = {
        indexNumber: 'ED12345',
        newStatus: 'In breach'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/change-status',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toContain(`${nextScreenUrl}/ED12345?src=`)
      expect(updateStatus).not.toHaveBeenCalled()
    })

    test('POST /cdo/edit/change-status route returns 404 given validation failed and no cdo', async () => {
      getCdo.mockResolvedValue(null)

      updateStatus.mockResolvedValue()

      const payload = {
        indexNumber: 'ED12345'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/change-status',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })
  })

  describe('POST /cdo/edit/dog-details', () => {
    test('POST /cdo/edit/dog-details route returns 400 when payload is invalid', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Exempt',
          indexNumber: 'ED12345'
        }
      })
      updateStatus.mockResolvedValue()

      const options = {
        method: 'POST',
        url: '/cdo/edit/change-status',
        auth,
        payload: {}
      }

      const response = await server.inject(options)

      const { document } = (new JSDOM(response.payload)).window

      expect(response.statusCode).toBe(400)
      expect(updateStatus).not.toHaveBeenCalled()
      expect(document.querySelector('.govuk-error-summary')).not.toBeNull()
    })

    test('POST /cdo/edit/dog-details route returns 400 when update returns a 409 microchip Conflict', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Exempt',
          indexNumber: 'ED12345',
          microchipNumber: ''
        }
      })
      updateStatus.mockRejectedValue(new ApiConflictError(new ApiErrorFailure('409 Conflict', {
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
        indexNumber: 'ED12345',
        newStatus: 'Inactive'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/change-status',
        auth,
        payload
      }

      const response = await server.inject(options)

      const { document } = (new JSDOM(response.payload)).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('.govuk-error-summary').textContent).toContain('The microchip number is in use on another record.')
    })

    test('POST /cdo/edit/dog-details route returns 500 when payload is invalid', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Exempt',
          indexNumber: 'ED12345'
        }
      })
      updateStatus.mockRejectedValue(new Error('server error'))

      const payload = {
        indexNumber: 'ED12345',
        newStatus: 'Inactive'
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/change-status',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(500)
    })
  })

  describe('GET /cdo/edit/change-status/in-breach', () => {
    test('route returns 200', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Exempt',
          indexNumber: 'ED12345'
        }
      })
      getBreachCategories.mockResolvedValue([
        {
          id: 1,
          label: 'Dog not covered by third party insurance',
          short_name: 'NOT_COVERED_BY_INSURANCE'
        },
        {
          id: 2,
          label: 'Dog not kept on lead or muzzled',
          short_name: 'NOT_ON_LEAD_OR_MUZZLED'
        },
        {
          id: 3,
          label: 'Dog kept in insecure place',
          short_name: 'INSECURE_PLACE'
        }
      ])

      const options = {
        method: 'GET',
        url: '/cdo/edit/change-status/in-breach/ED12345',
        auth
      }

      const response = await server.inject(options)
      const { document } = (new JSDOM(response.payload)).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('What is the reason for the breach?')
      expect(document.querySelectorAll('.govuk-hint')[0].textContent.trim()).toBe('Select all that apply.')
      expect(document.querySelectorAll('.govuk-checkboxes__item')[0].textContent.trim()).toBe('Dog not covered by third party insurance')
      expect(document.querySelectorAll('.govuk-checkboxes__item .govuk-checkboxes__input')[0].getAttribute('value')).toBe('NOT_COVERED_BY_INSURANCE')
      expect(document.querySelectorAll('.govuk-checkboxes__item')[1].textContent.trim()).toBe('Dog not kept on lead or muzzled')
      expect(document.querySelectorAll('.govuk-checkboxes__item')[2].textContent.trim()).toBe('Dog kept in insecure place')
    })

    test('route returns 404 when dog not found', async () => {
      getCdo.mockResolvedValue(null)

      const options = {
        method: 'GET',
        url: '/cdo/edit/change-status/in-breach/ED12345',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })
  })

  describe('POST /cdo/edit/change-status/in-breach', () => {
    test('route returns 302 when successful', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Exempt',
          indexNumber: 'ED12345'
        }
      })
      setDogBreaches.mockResolvedValue({
        dog: {
          id: 12345,
          indexNumber: 'ED12345',
          status: {
            id: 8,
            status: 'In breach'
          }
        },
        dogBreaches: [
          {
            id: 1,
            label: 'Dog not covered by third party insurance',
            short_name: 'NOT_COVERED_BY_INSURANCE'
          },
          {
            id: 2,
            label: 'Dog not kept on lead or muzzled',
            short_name: 'NOT_ON_LEAD_OR_MUZZLED'
          },
          {
            id: 3,
            label: 'Dog kept in insecure place',
            short_name: 'INSECURE_PLACE'
          }
        ]
      })

      const payload = {
        indexNumber: 'ED12345',
        dogBreaches: [
          'NOT_COVERED_BY_INSURANCE',
          'NOT_ON_LEAD_OR_MUZZLED',
          'INSECURE_PLACE'
        ]
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/change-status/in-breach/ED12345',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(setDogBreaches).toHaveBeenCalledWith(payload, expect.any(Object))
    })

    test('route returns 400 with missing index number', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Exempt',
          indexNumber: 'ED12345'
        }
      })
      getBreachCategories.mockResolvedValue([
        {
          id: 1,
          label: 'Dog not covered by third party insurance',
          short_name: 'NOT_COVERED_BY_INSURANCE'
        },
        {
          id: 2,
          label: 'Dog not kept on lead or muzzled',
          short_name: 'NOT_ON_LEAD_OR_MUZZLED'
        },
        {
          id: 3,
          label: 'Dog kept in insecure place',
          short_name: 'INSECURE_PLACE'
        }
      ])

      const options = {
        method: 'POST',
        url: '/cdo/edit/change-status/in-breach/ED12345',
        auth,
        payload: {
          dogBreaches: [
            'NOT_COVERED_BY_INSURANCE',
            'NOT_ON_LEAD_OR_MUZZLED'
          ]
        }
      }

      const response = await server.inject(options)
      const { document } = (new JSDOM(response.payload)).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('.govuk-error-summary')).not.toBeNull()
    })

    test('route returns 400 with empty payload', async () => {
      getCdo.mockResolvedValue({
        dog: {
          status: 'Exempt',
          indexNumber: 'ED12345'
        }
      })
      getBreachCategories.mockResolvedValue([
        {
          id: 1,
          label: 'Dog not covered by third party insurance',
          short_name: 'NOT_COVERED_BY_INSURANCE'
        },
        {
          id: 2,
          label: 'Dog not kept on lead or muzzled',
          short_name: 'NOT_ON_LEAD_OR_MUZZLED'
        },
        {
          id: 3,
          label: 'Dog kept in insecure place',
          short_name: 'INSECURE_PLACE'
        }
      ])

      const options = {
        method: 'POST',
        url: '/cdo/edit/change-status/in-breach/ED12345',
        auth,
        payload: {
          indexNumber: 'ED12345'
        }
      }

      const response = await server.inject(options)
      const { document } = (new JSDOM(response.payload)).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('.govuk-error-summary')).not.toBeNull()
      expect(document.querySelectorAll('.govuk-error-summary__list a')[0].textContent.trim()).toBe('Select all reasons the dog is in breach')
    })

    test('route returns 404 when dog not found', async () => {
      getCdo.mockResolvedValue(null)
      setDogBreaches.mockResolvedValue({
        dog: {
          id: 12345,
          indexNumber: 'ED12345',
          status: {
            id: 8,
            status: 'In breach'
          }
        },
        dogBreaches: [
          {
            id: 1,
            label: 'Dog not covered by third party insurance',
            short_name: 'NOT_COVERED_BY_INSURANCE'
          },
          {
            id: 2,
            label: 'Dog not kept on lead or muzzled',
            short_name: 'NOT_ON_LEAD_OR_MUZZLED'
          },
          {
            id: 3,
            label: 'Dog kept in insecure place',
            short_name: 'INSECURE_PLACE'
          }
        ]
      })

      const payload = {
        dogBreaches: [
          'NOT_COVERED_BY_INSURANCE',
          'NOT_ON_LEAD_OR_MUZZLED',
          'INSECURE_PLACE'
        ]
      }

      const options = {
        method: 'POST',
        url: '/cdo/edit/change-status/in-breach/ED12345',
        auth,
        payload
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
