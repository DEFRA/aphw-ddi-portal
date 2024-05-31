const { auth, user } = require('../../../../../mocks/auth')
const { UTCDate } = require('@date-fns/utc')
const { JSDOM } = require('jsdom')

describe('Add dog details', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/cdo/dog')
  const { getDogs, addAnotherDog } = require('../../../../../../app/session/cdo/dog')

  jest.mock('../../../../../../app/session/cdo/owner')
  const { getAddress, getEnforcementDetails } = require('../../../../../../app/session/cdo/owner')

  jest.mock('../../../../../../app/lib/model-helpers')
  const { setPoliceForce } = require('../../../../../../app/lib/model-helpers')

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
    getAddress.mockReturnValue(null)
    getEnforcementDetails.mockReturnValue(null)
    setPoliceForce.mockResolvedValue()
  })

  describe('GET /cdo/create/confirm-dog-details', () => {
    test('route renders single dog', async () => {
      getDogs.mockReturnValue([{
        breed: 'Breed 1',
        name: 'Bruce',
        cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
        cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
      }])

      const options = {
        method: 'GET',
        url: '/cdo/create/confirm-dog-details',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelectorAll('.govuk-summary-list').length).toBe(1)

      const summaryList = document.querySelector('.govuk-summary-list')

      expect(summaryList.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[0].textContent.trim()).toBe('Breed')
      expect(summaryList.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[0].textContent.trim()).toBe('Breed 1')
      expect(summaryList.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[1].textContent.trim()).toBe('Name')
      expect(summaryList.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[1].textContent.trim()).toBe('Bruce')
      expect(summaryList.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[2].textContent.trim()).toBe('CDO issued')
      expect(summaryList.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[2].textContent.trim()).toBe('10 October 2020')
      expect(summaryList.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[3].textContent.trim()).toBe('CDO expiry')
      expect(summaryList.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[3].textContent.trim()).toBe('10 December 2020')

      const summaryCard = document.querySelector('.govuk-summary-card')

      const actions = summaryCard.querySelectorAll('.govuk-summary-card__action a')
      expect(actions.length).toBe(1)
      expect(actions[0].attributes.href.textContent).toBe('/cdo/create/microchip-search/1')
    })

    test('route forwards to application-type if single dog that is existing dog', async () => {
      getDogs.mockReturnValue([{
        breed: 'Breed 1',
        name: 'Bruce',
        indexNumber: 'ED123',
        cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
        cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
      }])

      const options = {
        method: 'GET',
        url: '/cdo/create/confirm-dog-details',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toContain('/cdo/create/application-type')
    })

    test('route renders multple dogs', async () => {
      getDogs.mockReturnValue([{
        breed: 'Breed 1',
        name: 'Bruce',
        cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
        cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
      }, {
        breed: 'Breed 2',
        name: 'Fido',
        cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
        cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
      }])

      const options = {
        method: 'GET',
        url: '/cdo/create/confirm-dog-details',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelectorAll('.govuk-summary-list').length).toBe(2)

      const summaryCard = document.querySelectorAll('.govuk-summary-card')
      const summaryList = document.querySelectorAll('.govuk-summary-list')

      expect(summaryCard[0].querySelectorAll('.govuk-summary-card__actions a')[0].attributes.href.textContent).toBe('/cdo/create/microchip-search/1')
      expect(summaryCard[0].querySelectorAll('.govuk-summary-card__actions a')[1].attributes.href.textContent).toBe('/cdo/create/confirm-dog-delete/1')
      expect(summaryList[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[0].textContent.trim()).toBe('Breed')
      expect(summaryList[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[0].textContent.trim()).toBe('Breed 1')
      expect(summaryList[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[1].textContent.trim()).toBe('Name')
      expect(summaryList[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[1].textContent.trim()).toBe('Bruce')
      expect(summaryList[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[2].textContent.trim()).toBe('CDO issued')
      expect(summaryList[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[2].textContent.trim()).toBe('10 October 2020')
      expect(summaryList[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[3].textContent.trim()).toBe('CDO expiry')
      expect(summaryList[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[3].textContent.trim()).toBe('10 December 2020')

      expect(summaryCard[1].querySelectorAll('.govuk-summary-card__actions a')[0].attributes.href.textContent).toBe('/cdo/create/microchip-search/2')
      expect(summaryCard[1].querySelectorAll('.govuk-summary-card__actions a')[1].attributes.href.textContent).toBe('/cdo/create/confirm-dog-delete/2')
      expect(summaryList[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[0].textContent.trim()).toBe('Breed')
      expect(summaryList[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[0].textContent.trim()).toBe('Breed 2')
      expect(summaryList[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[1].textContent.trim()).toBe('Name')
      expect(summaryList[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[1].textContent.trim()).toBe('Fido')
      expect(summaryList[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[2].textContent.trim()).toBe('CDO issued')
      expect(summaryList[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[2].textContent.trim()).toBe('10 October 2020')
      expect(summaryList[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[3].textContent.trim()).toBe('CDO expiry')
      expect(summaryList[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[3].textContent.trim()).toBe('10 December 2020')
    })

    test('route returns 302 if not auth', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/create/confirm-dog-details'
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })
  })

  describe('POST /cdo/create/confirm-dog-details', () => {
    test('route with valid payload returns 302', async () => {
      const options = {
        method: 'POST',
        url: '/cdo/create/confirm-dog-details',
        auth,
        payload: {}
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/cdo/create/enforcement-details')
    })

    test('route with single existing dog returns 302', async () => {
      getDogs.mockReturnValue([{
        breed: 'Breed 1',
        name: 'Bruce',
        indexNumber: 'ED123',
        cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
        cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
      }])

      const options = {
        method: 'POST',
        url: '/cdo/create/confirm-dog-details',
        auth,
        payload: {}
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/cdo/create/application-type/1')
    })

    test('route with add another dog returns 302', async () => {
      const payload = {
        addAnotherDog: ''
      }

      const options = {
        method: 'POST',
        url: '/cdo/create/confirm-dog-details',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/cdo/create/microchip-search')
      expect(addAnotherDog).toHaveBeenCalledTimes(1)
      expect(setPoliceForce).not.toHaveBeenCalled()
    })

    test('route sets police force and returns 302', async () => {
      const payload = {}

      const options = {
        method: 'POST',
        url: '/cdo/create/confirm-dog-details',
        auth,
        payload
      }

      getDogs.mockReturnValue()

      getAddress.mockReturnValue({ postcode: 'TS1 1TS' })
      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/cdo/create/enforcement-details')
      expect(addAnotherDog).not.toHaveBeenCalled()
      expect(setPoliceForce).toHaveBeenCalledTimes(1)
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })
})
