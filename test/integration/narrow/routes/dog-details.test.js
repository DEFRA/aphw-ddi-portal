const { admin } = require('../../../../app/auth/permissions')
const querystring = require('querystring')

describe('Add dog details', () => {
  jest.mock('../../../../app/api/ddi-index-api')
  const { getBreeds } = require('../../../../app/api/ddi-index-api')

  jest.mock('../../../../app/auth')
  const mockAuth = require('../../../../app/auth')

  jest.mock('../../../../app/session/cdo/dog')
  const { getDog, setDog } = require('../../../../app/session/cdo/dog')

  const createServer = require('../../../../app/server')
  let server

  const auth = { strategy: 'session-auth', credentials: { scope: [admin] } }

  const user = {
    userId: '1',
    username: 'test@example.com'
  }

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    getBreeds.mockResolvedValue({
      breeds: [
        { breed: 'Breed 1' },
        { breed: 'Breed 2' },
        { breed: 'Breed 3' }
      ]
    })

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/dog-details route returns 200', async () => {
    getDog.mockReturnValue({})

    const options = {
      method: 'GET',
      url: '/cdo/create/dog-details',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/create/owner-details route returns 302 if not auth', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/dog-details'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/create/dog-details route with valid payload returns 302', async () => {
    const payload = {
      breed: 'Breed 1',
      name: 'Bruce',
      'cdoIssued-day': '10',
      'cdoIssued-month': '10',
      'cdoIssued-year': '2020'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/dog-details',
      auth,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      payload: querystring.stringify(payload)
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(setDog).toHaveBeenCalledTimes(1)
    expect(setDog).toHaveBeenCalledWith(expect.anything(), {
      breed: 'Breed 1',
      name: 'Bruce',
      cdoIssued: new Date('2020-10-10T00:00:00.000Z'),
      cdoExpiry: new Date('2020-12-10T00:00:00.000Z')
    })
    expect(response.headers.location).toContain('/cdo/create/confirm-dog-details')
  })

  test('POST /cdo/create/dog-details route with invalid payload returns 400', async () => {
    const payload = {
      breed: 'Breed 1',
      name: 'Bruce',
      'cdoIssued-day': '12'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/dog-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(400)
    expect(setDog).not.toHaveBeenCalled()
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
