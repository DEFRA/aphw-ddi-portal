const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const FormData = require('form-data')
const Boom = require('@hapi/boom')

describe('Delete Dog', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/dog')
  const { getDogDetails, deleteDog, getDogOwnerWithDogs } = require('../../../../../../app/api/ddi-index-api/dog')

  jest.mock('../../../../../../app/api/ddi-index-api/person')
  const { getPersonByReference, deletePerson } = require('../../../../../../app/api/ddi-index-api/person')

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
    getDogOwnerWithDogs.mockResolvedValue({
      firstName: 'Ralph',
      lastName: 'Wreck it',
      birthDate: null,
      personReference: 'P-4169-0315',
      contacts: [],
      dogs: [
        {
          id: 24957,
          indexNumber: 'ED24957',
          name: 'Kyleigh'
        },
        {
          id: 300741,
          indexNumber: 'ED300741',
          name: 'Lassie'
        }
      ]
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
      expect(getDogOwnerWithDogs).toHaveBeenCalled()
      expect(document.querySelector('h1').textContent.trim()).toBe('Are you sure you want to delete dog record ED200010?')
      expect(document.querySelector('input[name=\'ownerPk\']')).toBeNull()
    })

    test('GET /cdo/delete/dog route returns 200 and includes hidden ownerPk input given admin and dog is last dog of owner', async () => {
      getDogOwnerWithDogs.mockResolvedValue({
        firstName: 'Ralph',
        lastName: 'Wreck it',
        birthDate: null,
        personReference: 'P-4169-0315',
        contacts: [],
        dogs: [
          {
            id: 24957,
            indexNumber: 'ED24957',
            name: 'Kyleigh'
          }
        ]
      })
      const options = {
        method: 'GET',
        url: '/cdo/delete/dog/ED200010',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(getDogOwnerWithDogs).toHaveBeenCalled()
      expect(document.querySelector('h1').textContent.trim()).toBe('Are you sure you want to delete dog record ED200010?')
      expect(document.querySelector('input[name=\'ownerPk\']').getAttribute('value')).toBe('P-4169-0315')
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
      confirm: 'Y',
      pk: 'ED24957'
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
      expect(document.querySelector('#main-content').textContent.trim()).toContain('Deleted records no longer appear in search results.')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('Raise a support ticket within the next 90 days if you need to recover a deleted dog record.')
    })

    test('POST /cdo/delete/dog route returns 302 given no selected', async () => {
      getDogDetails.mockResolvedValue({
        id: 24957,
        indexNumber: 'ED24957',
        name: 'Kyleigh'
      })
      getCdo.mockResolvedValue({
        dog: {
          id: 1,
          indexNumber: 'ED24957',
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

  describe('POST /cdo/delete/dog with owner', () => {
    beforeEach(() => {
      getPersonByReference.mockResolvedValue({
        firstName: 'Mark',
        lastName: 'Turner',
        birthDate: '1998-05-10',
        personReference: 'P-35E5-8264',
        address: {
          addressLine1: 'Flat 504',
          addressLine2: '1 Pepys Street',
          town: 'City of London',
          postcode: 'EC3N 2NU',
          country: 'England'
        },
        contacts: {
          emails: [],
          primaryTelephones: [],
          secondaryTelephones: []
        }
      })
      getDogDetails.mockResolvedValue({
        id: 200011,
        indexNumber: 'ED200011',
        name: 'Kyleigh'
      })
    })

    test('should return 302 to dog details page given No selected on dog are you sure', async () => {
      getDogDetails.mockResolvedValue({
        id: 300006,
        indexNumber: 'ED300006',
        name: 'Kyleigh'
      })
      getCdo.mockResolvedValue({
        dog: {
          id: 1,
          indexNumber: 'ED300006',
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
      const payload = { confirm: 'N', pk: 'ED300006', ownerPk: 'P-5658-7F92', confirmation: true }
      const options = {
        method: 'POST',
        url: '/cdo/delete/dog/ED300006',
        auth,
        payload
      }
      const response = await server.inject(options)

      // const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(302)
    })

    test('should return 200 given admin and Yes payload and ownerPk', async () => {
      const options = {
        method: 'POST',
        url: '/cdo/delete/dog/ED200011',
        auth,
        payload: {
          confirm: 'Y',
          pk: 'ED200011',
          ownerPk: 'P-35E5-8264',
          confirmation: 'true'
        }
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)

      expect(getPersonByReference).toHaveBeenCalledWith('P-35E5-8264', user)
      expect(document.querySelector('h1').textContent.trim()).toBe('Delete the owner record')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('Deleting dog record ED200011 means the owner record Mark Turner no longer has a dog linked to it.')
      expect(document.querySelector('legend').textContent.trim()).toContain('Delete the owner record for Mark Turner?')
      expect(document.querySelector('input[name=\'ownerPk\']').getAttribute('value')).toBe('P-35E5-8264')
      expect(document.querySelector('input[name=\'pk\']').getAttribute('value')).toBe('ED200011')
      expect(document.querySelector('input[name=\'confirm\']').getAttribute('value')).toBe('Y')
    })

    test('should return 400 given admin and Yes payload and ownerPk without owner confirmation', async () => {
      const options = {
        method: 'POST',
        url: '/cdo/delete/dog/ED200011',
        auth,
        payload: {
          confirm: 'Y',
          pk: 'ED200011',
          ownerPk: 'P-35E5-8264',
          ownerConfirmation: 'true'
        }
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)

      expect(document.querySelector('h1').textContent.trim()).toBe('Delete the owner record')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Select an option')
    })

    test('should return 200 given admin and Yes payload, ownerPk and confirmOwner payload', async () => {
      const payload = {
        confirm: 'Y',
        pk: 'ED200011',
        ownerPk: 'P-E516-0334',
        confirmOwner: 'Y',
        ownerConfirmation: 'true'
      }

      const options = {
        method: 'POST',
        url: '/cdo/delete/dog/ED200011',
        auth,
        payload
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(deleteDog).toHaveBeenCalledWith('ED200011', user)
      expect(deletePerson).toHaveBeenCalledWith('P-E516-0334', user)

      expect(document.querySelector('h1').textContent.trim()).toBe('Records deleted')
      expect(document.querySelector('.govuk-panel .govuk-panel__body').textContent.trim()).toBe('Dog ED200011 and Mark Turner')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('Deleted records no longer appear in search results.')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('Raise a support ticket within the next 90 days if you need to recover deleted records.')
    })

    test('should return 200 given admin and Yes payload, ownerPk and confirmOwner N', async () => {
      const payload = {
        confirm: 'Y',
        ownerPk: 'P-E516-0334',
        pk: 'ED200011',
        confirmOwner: 'N',
        ownerConfirmation: 'true'
      }

      const options = {
        method: 'POST',
        url: '/cdo/delete/dog/ED200011',
        auth,
        payload
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(deleteDog).toHaveBeenCalledWith('ED200011', user)

      expect(document.querySelector('h1').textContent.trim()).toBe('Dog record deleted')
      expect(document.querySelector('.govuk-panel .govuk-panel__body').textContent.trim()).toBe('Dog ED200011')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('Deleted records no longer appear in search results.')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('Raise a support ticket within the next 90 days if you need to recover a deleted dog record.')
    })

    test('should return 302 given admin and No payload', async () => {
      const payload = {
        confirm: 'N',
        ownerPk: 'P-E516-0334',
        pk: 'ED200011',
        confirmOwner: 'N',
        ownerConfirmation: 'true'
      }

      const options = {
        method: 'POST',
        url: '/cdo/delete/dog/ED200011',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/cdo/view/dog-details/ED200011')
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
