const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const FormData = require('form-data')
const Boom = require('@hapi/boom')

describe('Delete Dog', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/dog')
  const { getDogDetails, deleteDog } = require('../../../../../../app/api/ddi-index-api/dog')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /cdo/delete/dog', () => {
    getDogDetails.mockResolvedValue({
      id: 24957,
      indexNumber: 'ED24957',
      name: 'Kyleigh'
    })

    test('GET /cdo/delete/dog route returns 200 given admin', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/delete/dog/ED200010',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1').textContent.trim()).toBe('Are you sure you want to delete dog record ED200010?')
    })

    test('GET /cdo/delete/dog route returns 403 given standard user', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/delete/dog/ED200010',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })

    test('GET /cdo/delete/dog route returns 404 if no data found', async () => {
      getDogDetails.mockRejectedValue(new Boom.Boom('Not found', { statusCode: 404 }))

      const options = {
        method: 'GET',
        url: '/cdo/delete/dog/ED200010',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })
  })

  describe('POST /cdo/delete/dog', () => {
    const payload = {
      confirm: 'Y'
    }

    test('POST /cdo/delete/dog route returns 200 given admin and Yes payload', async () => {
      getDogDetails.mockResolvedValue({
        id: 24957,
        indexNumber: 'ED24957',
        name: 'Kyleigh'
      })
      const options = {
        method: 'POST',
        url: '/cdo/delete/dog/ED200010',
        auth,
        payload
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(deleteDog).toHaveBeenCalledWith('ED200010', user)
      expect(document.querySelector('h1').textContent.trim()).toBe('Dog record deleted')
      expect(document.querySelector('.govuk-panel .govuk-panel__body').textContent.trim()).toBe('Dog ED200010')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('Dog record ED200010 will no longer appear in search results or on the owner record.')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('Raise a support ticket if you need to recover a deleted dog record.')
    })

    test('POST /cdo/delete/dog route returns 400 given radio returns 302 given no selected', async () => {
      getDogDetails.mockResolvedValue({
        id: 24957,
        indexNumber: 'ED123',
        name: 'Kyleigh'
      })
      getCdo.mockResolvedValue({
        dog: {
          id: 1,
          indexNumber: 'ED123',
          name: 'Bruno',
          status: { status: 'TEST' },
          dog_breed: { breed: 'breed1' }
        },
        person: {
          firstName: 'John Smith',
          addresses: [{
            address: {
            }
          }],
          person_contacts: []
        },
        exemption: {
          exemptionOrder: 2015,
          insurance: [{
            company: 'Dogs Trust'
          }]
        }
      })

      const options = {
        method: 'POST',
        url: '/cdo/delete/dog/ED123',
        auth,
        payload: {
          confirm: 'N'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(deleteDog).not.toHaveBeenCalled()
    })

    test('POST /cdo/delete/dog route with a confirmation returns 400 given radio not entered', async () => {
      getDogDetails.mockResolvedValue({
        id: 24957,
        indexNumber: 'ED24957',
        name: 'Kyleigh'
      })

      const options = {
        method: 'POST',
        url: '/cdo/delete/dog/ED200010',
        auth,
        payload: {}
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1').textContent.trim()).toBe('Are you sure you want to delete dog record ED200010?')
      expect(document.querySelector('h2.govuk-error-summary__title').textContent.trim()).toBe('There is a problem')
      expect(document.querySelectorAll('.govuk-error-summary__list li')[0].textContent.trim()).toBe('Select an option')
    })

    test('POST /cdo/delete/dog route returns 403 given standard user', async () => {
      const options = {
        method: 'POST',
        url: '/cdo/delete/dog/ED200010',
        auth: standardAuth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })

    test('POST /cdo/delete/dog route returns 404 if no data found', async () => {
      getDogDetails.mockRejectedValue(new Boom.Boom('Not found', { statusCode: 404 }))

      const options = {
        method: 'POST',
        url: '/cdo/delete/dog/ED200010',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })

    test('POST /cdo/delete/dog route returns 302 if not auth', async () => {
      const fd = new FormData()
      fd.append('confirm', 'Y')

      const options = {
        method: 'POST',
        url: '/cdo/delete/dog/ED200010',
        headers: fd.getHeaders(),
        payload: fd.getBuffer()
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
