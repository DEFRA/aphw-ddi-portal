const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Microchip search tests', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/cdo/dog')
  const { getDog, getMicrochipDetails } = require('../../../../../../app/session/cdo/dog')

  jest.mock('../../../../../../app/api/ddi-index-api/search')
  const { doSearch } = require('../../../../../../app/api/ddi-index-api/search')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    doSearch.mockResolvedValue([])
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/microchip-search route returns 200', async () => {
    getDog.mockReturnValue({})
    getMicrochipDetails.mockReturnValue({})

    const options = {
      method: 'GET',
      url: '/cdo/create/microchip-search',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelector('h1').textContent.trim()).toBe('What is the microchip number?')
  })

  test('GET /cdo/create/microchip-search route returns 404 when dog not found', async () => {
    getDog.mockReturnValue(undefined)
    getMicrochipDetails.mockReturnValue({})

    const options = {
      method: 'GET',
      url: '/cdo/create/microchip-search',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  test('POST /cdo/create/microchip-search route with invalid payload returns 400 error 1', async () => {
    const payload = {
      microchipNumber: '123-456'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/microchip-search',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(document.querySelector('#microchipNumber-error').textContent.trim()).toBe('Error: Microchip numbers can only contain numbers')
  })

  test('POST /cdo/create/microchip-search route with invalid payload returns 400 error 2', async () => {
    const payload = {
      microchipNumber: ''
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/microchip-search',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(document.querySelector('#microchipNumber-error').textContent.trim()).toBe('Error: Enter a microchip number')
  })

  test('POST /cdo/create/microchip-search route with invalid payload returns 400 error 3', async () => {
    const payload = {
      microchipNumber: '1234567890123456'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/microchip-search',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(document.querySelector('#microchipNumber-error').textContent.trim()).toBe('Error: Microchip number must be no more than 15 characters')
  })

  test('POST /cdo/create/microchip-search route with valid payload performs search zero results', async () => {
    const payload = {
      microchipNumber: '123456789012345'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/microchip-search',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(doSearch).toHaveBeenCalledWith({ searchType: 'dog', searchTerms: '123456789012345' })
    expect(response.headers.location).toBe('/cdo/create/dog-details')
  })

  test('POST /cdo/create/microchip-search route with valid payload performs search one or more results', async () => {
    doSearch.mockResolvedValue([{ id: 1 }, { id: 2 }])

    const payload = {
      microchipNumber: '123456789012345'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/microchip-search',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(doSearch).toHaveBeenCalledWith({ searchType: 'dog', searchTerms: '123456789012345' })
    expect(response.headers.location).toBe('/cdo/create/microchip-results')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
