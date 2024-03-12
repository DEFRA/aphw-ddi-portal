const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const { routes } = require('../../../../../../app/constants/cdo/owner')

describe('OwnerResults test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/persons')
  const { getPersons } = require('../../../../../../app/api/ddi-index-api/persons')

  jest.mock('../../../../../../app/session/cdo/owner')
  const { getOwnerDetails } = require('../../../../../../app/session/cdo/owner')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/select-owner route returns 302 given one person found', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/select-owner',
      auth
    }

    getPersons.mockResolvedValue([{ personReference: 'P-123-456', firstName: 'Joe', lastName: 'Bloggs' }])
    getOwnerDetails.mockReturnValue({ firstName: 'John', lastName: 'Smith' })

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = new JSDOM(response.payload).window

    expect(document.location.href).toBe(routes.selectAddress.get)
    expect(getPersons).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Smith' })
  })

  test('GET /cdo/create/select-owner route returns 200 given more than one person found', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/select-owner',
      auth
    }

    getPersons.mockResolvedValue([{ personReference: 'P-123-456', firstName: 'Joe', lastName: 'Bloggs' }])
    getOwnerDetails.mockReturnValue({ firstName: 'John', lastName: 'Smith' })

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = new JSDOM(response.payload).window

    expect(document.location.href).toBe(routes.selectOwner.get)
    expect(getPersons).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Smith' })
  })

  test('GET /cdo/create/select-owner route returns 200 given more than one person found', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/select-owner',
      auth
    }

    getPersons.mockResolvedValue([{ personReference: 'P-123-456', firstName: 'Joe', lastName: 'Bloggs' }])
    getOwnerDetails.mockReturnValue({ firstName: 'John', lastName: 'Smith' })

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = new JSDOM(response.payload).window

    expect(document.location.href).toBe(routes.selectOwner.get)
    expect(getPersons).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Smith' })
  })

  test('GET /cdo/create/select-owner route returns 302 given no persons found', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/select-owner',
      auth
    }

    getPersons.mockResolvedValue([])
    getOwnerDetails.mockReturnValue({ firstName: 'John', lastName: 'Smith' })

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)

    const { document } = new JSDOM(response.payload).window

    expect(document.location.href).toBe(routes.postcodeLookupCreate.get)
    expect(getPersons).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Smith' })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
