const { auth, user } = require('../../../../../mocks/auth')
const { UTCDate } = require('@date-fns/utc')
const { JSDOM } = require('jsdom')

describe('Add dog details', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/cdo/dog')
  const { getDogs, getDog, deleteDog } = require('../../../../../../app/session/cdo/dog')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/confirm-dog-delete route renders single dog', async () => {
    getDogs.mockReturnValue([{
      breed: 'Breed 1',
      name: 'Bruce',
      cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
      cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
    }, {
      breed: 'Breed 2',
      name: 'Bella',
      cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
      cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
    }])

    getDog.mockReturnValue({
      breed: 'Breed 1',
      name: 'Bruce',
      cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
      cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
    })

    const options = {
      method: 'GET',
      url: '/cdo/create/confirm-dog-delete/1',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelectorAll('.govuk-summary-list').length).toBe(1)

    const summaryList = document.querySelector('.govuk-summary-list')

    expect(summaryList.querySelectorAll('.govuk-summary-list__key')[0].textContent).toBe('Breed')
    expect(summaryList.querySelectorAll('.govuk-summary-list__value')[0].textContent).toBe('Breed 1')
    expect(summaryList.querySelectorAll('.govuk-summary-list__key')[1].textContent).toBe('Name')
    expect(summaryList.querySelectorAll('.govuk-summary-list__value')[1].textContent).toBe('Bruce')
    expect(summaryList.querySelectorAll('.govuk-summary-list__key')[2].textContent).toBe('CDO issued')
    expect(summaryList.querySelectorAll('.govuk-summary-list__value')[2].textContent).toBe('10 October 2020')
    expect(summaryList.querySelectorAll('.govuk-summary-list__key')[3].textContent).toBe('CDO expiry')
    expect(summaryList.querySelectorAll('.govuk-summary-list__value')[3].textContent).toBe('10 December 2020')

    expect(document.querySelector('input[type="hidden"][name="dogId"]').value).toBe('1')
  })

  test('GET /cdo/create/confirm-dog-delete redirects to confirm page if only one dog', async () => {
    getDogs.mockReturnValue([{
      breed: 'Breed 1',
      name: 'Bruce',
      cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
      cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
    }])

    const options = {
      method: 'GET',
      url: '/cdo/create/confirm-dog-delete/1',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/cdo/create/confirm-dog-details')
  })

  test('GET /cdo/create/confirm-dog-delete redirects to confirm page if no dogs', async () => {
    getDogs.mockReturnValue([])

    const options = {
      method: 'GET',
      url: '/cdo/create/confirm-dog-delete/1',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/cdo/create/confirm-dog-details')
  })

  test('POST /cdo/create/confirm-dog-delete deletes dog and redirects to confirm page', async () => {
    getDogs.mockReturnValue([{
      breed: 'Breed 1',
      name: 'Bruce',
      cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
      cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
    }, {
      breed: 'Breed 2',
      name: 'Bella',
      cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
      cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
    }])

    const options = {
      method: 'POST',
      url: '/cdo/create/confirm-dog-delete',
      auth,
      payload: {
        dogId: '1'
      }
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/cdo/create/confirm-dog-details')
    expect(deleteDog).toHaveBeenCalledWith(expect.objectContaining({
      payload: {
        dogId: '1'
      }
    }))
  })

  test('POST /cdo/create/confirm-dog-delete returns 400 if only one dog', async () => {
    getDogs.mockReturnValue([{
      breed: 'Breed 1',
      name: 'Bruce',
      cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
      cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
    }])

    const options = {
      method: 'POST',
      url: '/cdo/create/confirm-dog-delete',
      auth,
      payload: {
        dogId: '1'
      }
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(400)
    expect(deleteDog).not.toHaveBeenCalled()
  })

  test('POST /cdo/create/confirm-dog-delete returns 400 if no dogs', async () => {
    getDogs.mockReturnValue([])

    const options = {
      method: 'POST',
      url: '/cdo/create/confirm-dog-delete',
      auth,
      payload: {
        dogId: '1'
      }
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(400)
    expect(deleteDog).not.toHaveBeenCalled()
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
