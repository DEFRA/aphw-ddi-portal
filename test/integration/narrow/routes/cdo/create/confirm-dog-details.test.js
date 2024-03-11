const { auth, user } = require('../../../../../mocks/auth')
const { UTCDate } = require('@date-fns/utc')
const { JSDOM } = require('jsdom')

describe('Add dog details', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/cdo/dog')
  const { getDogs, addAnotherDog } = require('../../../../../../app/session/cdo/dog')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/confirm-dog-details route renders single dog', async () => {
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
    expect(summaryList.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[2].textContent.trim()).toBe('CDO issue date')
    expect(summaryList.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[2].textContent.trim()).toBe('10 October 2020')
    expect(summaryList.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[3].textContent.trim()).toBe('CDO expiry date')
    expect(summaryList.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[3].textContent.trim()).toBe('10 December 2020')

    const summaryCard = document.querySelector('.govuk-summary-card')

    const actions = summaryCard.querySelectorAll('.govuk-summary-card__action a')
    expect(actions.length).toBe(1)
    expect(actions[0].attributes.href.textContent).toBe('/cdo/create/dog-details/1')
  })

  test('GET /cdo/create/confirm-dog-details route renders multple dogs', async () => {
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

    expect(summaryCard[0].querySelectorAll('.govuk-summary-card__actions a')[0].attributes.href.textContent).toBe('/cdo/create/dog-details/1')
    expect(summaryCard[0].querySelectorAll('.govuk-summary-card__actions a')[1].attributes.href.textContent).toBe('/cdo/create/confirm-dog-delete/1')
    expect(summaryList[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[0].textContent.trim()).toBe('Breed')
    expect(summaryList[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[0].textContent.trim()).toBe('Breed 1')
    expect(summaryList[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[1].textContent.trim()).toBe('Name')
    expect(summaryList[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[1].textContent.trim()).toBe('Bruce')
    expect(summaryList[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[2].textContent.trim()).toBe('CDO issue date')
    expect(summaryList[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[2].textContent.trim()).toBe('10 October 2020')
    expect(summaryList[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[3].textContent.trim()).toBe('CDO expiry date')
    expect(summaryList[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[3].textContent.trim()).toBe('10 December 2020')

    expect(summaryCard[1].querySelectorAll('.govuk-summary-card__actions a')[0].attributes.href.textContent).toBe('/cdo/create/dog-details/2')
    expect(summaryCard[1].querySelectorAll('.govuk-summary-card__actions a')[1].attributes.href.textContent).toBe('/cdo/create/confirm-dog-delete/2')
    expect(summaryList[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[0].textContent.trim()).toBe('Breed')
    expect(summaryList[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[0].textContent.trim()).toBe('Breed 2')
    expect(summaryList[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[1].textContent.trim()).toBe('Name')
    expect(summaryList[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[1].textContent.trim()).toBe('Fido')
    expect(summaryList[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[2].textContent.trim()).toBe('CDO issue date')
    expect(summaryList[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[2].textContent.trim()).toBe('10 October 2020')
    expect(summaryList[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[3].textContent.trim()).toBe('CDO expiry date')
    expect(summaryList[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[3].textContent.trim()).toBe('10 December 2020')
  })

  test('GET /cdo/create/owner-details route returns 302 if not auth', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/confirm-dog-details'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/create/confirm-dog-details route with valid payload returns 302', async () => {
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

  test('POST /cdo/create/confirm-dog-details route with add another dog returns 302', async () => {
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
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
