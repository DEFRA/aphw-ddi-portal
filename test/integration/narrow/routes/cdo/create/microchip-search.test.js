const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Microchip search tests', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/cdo/dog')
  const { getDog, getDogs, getMicrochipResults } = require('../../../../../../app/session/cdo/dog')

  jest.mock('../../../../../../app/api/ddi-index-api/search')
  const { doSearch } = require('../../../../../../app/api/ddi-index-api/search')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    doSearch.mockResolvedValue([])
    getDog.mockReturnValue({})
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/microchip-search route returns 200', async () => {
    getDog.mockReturnValue({})
    getMicrochipResults.mockReturnValue({})

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
    getMicrochipResults.mockReturnValue({})

    const options = {
      method: 'GET',
      url: '/cdo/create/microchip-search',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  test('POST /cdo/create/microchip-search route with invalid payload returns 400 error hyphens', async () => {
    const payload = {
      microchipNumber: '123-456-789-123'
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

  test('POST /cdo/create/microchip-search route with invalid payload returns 400 error blank', async () => {
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

  test('POST /cdo/create/microchip-search route with invalid payload returns 400 error too long', async () => {
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
    expect(document.querySelector('#microchipNumber-error').textContent.trim()).toBe('Error: Microchip numbers must be 15 numbers long')
  })

  test('POST /cdo/create/microchip-search route with invalid payload returns 400 error too short', async () => {
    const payload = {
      microchipNumber: '12345678901234'
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
    expect(document.querySelector('#microchipNumber-error').textContent.trim()).toBe('Error: Microchip numbers must be 15 numbers long')
  })

  test('POST /cdo/create/microchip-search route with invalid payload returns 400 error space', async () => {
    const payload = {
      microchipNumber: '123 45678901234'
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

  test('POST /cdo/create/microchip-search route with invalid payload returns 400 error letters', async () => {
    const payload = {
      microchipNumber: '123a45689012345'
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

  test('POST /cdo/create/microchip-search route with duplicate microchip returns 400 error', async () => {
    getDogs.mockReturnValue([
      { id: 1, name: 'Rex', microchipNumber: '111112222233333' },
      { id: 2, name: 'Fido', microchipNumber: '123456789012345' },
      { id: 3, name: 'Bruce', microchipNumber: '222223333344444' }
    ])

    const payload = {
      microchipNumber: '123456789012345'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/microchip-search/1',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(document.querySelector('#microchipNumber-error').textContent.trim()).toBe('Error: This microchip number has already been used by Dog 2 (Fido)')
  })

  test('POST /cdo/create/microchip-search route with no duplicate microchip returns 302', async () => {
    getDogs.mockReturnValue([
      { id: 1, name: 'Rex', microchipNumber: '11111' },
      { id: 2, name: 'Fido', microchipNumber: '12345' },
      { id: 3, name: 'Bruce', microchipNumber: '12345' }
    ])

    const payload = {
      microchipNumber: '123456789012345'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/microchip-search/2',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/cdo/create/dog-details/2')
  })

  test('POST /cdo/create/microchip-search route with duplicate microchip on same dog returns 302', async () => {
    getDogs.mockReturnValue([
      { id: 1, name: 'Rex', microchipNumber: '11111' },
      { id: 2, name: 'Fido', microchipNumber: '22222' },
      { id: 3, name: 'Bruce', microchipNumber: '33333' }
    ])

    const payload = {
      microchipNumber: '222223333344444'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/microchip-search/2',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/cdo/create/dog-details/2')
  })

  test('POST /cdo/create/microchip-search route with no duplicate microchip returns 302 on dog 3', async () => {
    getDogs.mockReturnValue([
      { id: 1, name: 'Rex', microchipNumber: '11111' },
      { id: 2, name: 'Fido', microchipNumber: '12345' },
      { id: 3, name: 'Bruce', microchipNumber: '12345' }
    ])

    const payload = {
      microchipNumber: '123456789012345'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/microchip-search/3',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/cdo/create/dog-details/3')
  })

  test('POST /cdo/create/microchip-search route with duplicate microchip returns 400 error given no dog name', async () => {
    getDogs.mockReturnValue([
      { id: 1, name: 'Rex', microchipNumber: '111112222233333' },
      { id: 2, name: 'Fido', microchipNumber: '123451234512345' },
      { id: 3, name: '', microchipNumber: '222223333344444' }
    ])

    const payload = {
      microchipNumber: '222223333344444'
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
    expect(document.querySelector('#microchipNumber-error').textContent.trim()).toBe('Error: This microchip number has already been used by Dog 3')
  })

  test('POST /cdo/create/microchip-search route checks duplicate microchip when no dogs', async () => {
    getDogs.mockReturnValue()

    const payload = {
      microchipNumber: '123451234512345'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/microchip-search',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/cdo/create/dog-details/1')
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
    expect(response.headers.location).toBe('/cdo/create/dog-details/1')
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
    expect(response.headers.location).toBe('/cdo/create/microchip-results/1')
  })

  test('POST /cdo/create/microchip-search route with existing microchip of dog that owner already exists returns 400 error - microchip1', async () => {
    doSearch.mockResolvedValue([{ id: 1, microchipNumber: '123456789012345' }, { id: 2 }])

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

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(document.querySelector('#microchipNumber-error').textContent.trim()).toBe('Error: This dog is already owned by this owner')
  })

  test('POST /cdo/create/microchip-search route with existing microchip of dog that owner already exists returns 400 error - microchip2', async () => {
    doSearch.mockResolvedValue([{ id: 1, microchipNumber2: '123456789012345' }, { id: 2 }])

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

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(document.querySelector('#microchipNumber-error').textContent.trim()).toBe('Error: This dog is already owned by this owner')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
