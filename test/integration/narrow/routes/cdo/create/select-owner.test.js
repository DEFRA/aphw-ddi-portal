const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const { routes } = require('../../../../../../app/constants/cdo/owner')

describe('OwnerResults test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/persons')
  const { getPersons } = require('../../../../../../app/api/ddi-index-api/persons')

  jest.mock('../../../../../../app/session/cdo/owner')
  const { getOwnerDetails, setAddress } = require('../../../../../../app/session/cdo/owner')

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
    /**
     * @type {import('../../../../../../app/api/ddi-index-api/person').Person}
     */
    const resolvedPerson = {
      birthDate: '',
      contacts: undefined,
      firstName: 'Joe',
      lastName: 'Bloggs',
      personReference: 'P-123-456',
      address: {
        addressLine2: 'Snow Hill',
        country: 'England',
        postcode: 'CO10 8QX',
        town: 'Sudbury',
        addressLine1: 'Bully Green Farm'
      }
    }

    getPersons.mockResolvedValue([resolvedPerson])
    getOwnerDetails.mockReturnValue({
      firstName: 'John',
      lastName: 'Smith'
    })

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = new JSDOM(response.payload).window

    expect(getPersons).toBeCalledWith({ firstName: 'John', lastName: 'Smith' })
    expect(setAddress).toBeCalledWith(expect.anything(), {
      addressLine2: 'Snow Hill',
      country: 'England',
      postcode: 'CO10 8QX',
      town: 'Sudbury',
      addressLine1: 'Bully Green Farm'
    })
    expect(document.querySelector('h1').textContent).toBe('Confirm address')
    expect(document.querySelector('.govuk-grid-row form').textContent).toContain('Bully Green Farm')
    expect(document.querySelector('.govuk-grid-row form .govuk-button').textContent.trim()).toBe('Confirm address')
    expect(document.querySelector('.govuk-grid-row form .govuk-link').textContent).toBe('Change address')
    expect(document.querySelector('.govuk-grid-row form .govuk-link').getAttribute('href')).toBe(routes.address.get)
  })

  // test('GET /cdo/create/select-owner route returns 200 given more than one person found', async () => {
  //   const options = {
  //     method: 'GET',
  //     url: '/cdo/create/select-owner',
  //     auth
  //   }
  //
  //   getPersons.mockResolvedValue([{ personReference: 'P-123-456', firstName: 'Joe', lastName: 'Bloggs' }])
  //   getOwnerDetails.mockReturnValue({ firstName: 'John', lastName: 'Smith' })
  //
  //   const response = await server.inject(options)
  //   expect(response.statusCode).toBe(200)
  //
  //   const { document } = new JSDOM(response.payload).window
  //
  //   expect(getPersons).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Smith' })
  //   expect(document.location.href).toBe(routes.selectOwner.get)
  // })
  //
  // test('GET /cdo/create/select-owner route returns 200 given more than one person found', async () => {
  //   const options = {
  //     method: 'GET',
  //     url: '/cdo/create/select-owner',
  //     auth
  //   }
  //
  //   getPersons.mockResolvedValue([{ personReference: 'P-123-456', firstName: 'Joe', lastName: 'Bloggs' }])
  //   getOwnerDetails.mockReturnValue({ firstName: 'John', lastName: 'Smith' })
  //
  //   const response = await server.inject(options)
  //   expect(response.statusCode).toBe(200)
  //
  //   const { document } = new JSDOM(response.payload).window
  //
  //   expect(getPersons).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Smith' })
  //   expect(document.location.href).toBe(routes.selectOwner.get)
  // })
  //
  // test('GET /cdo/create/select-owner route returns 302 given no persons found', async () => {
  //   const options = {
  //     method: 'GET',
  //     url: '/cdo/create/select-owner',
  //     auth
  //   }
  //
  //   getPersons.mockResolvedValue([])
  //   getOwnerDetails.mockReturnValue({ firstName: 'John', lastName: 'Smith' })
  //
  //   const response = await server.inject(options)
  //   expect(response.statusCode).toBe(302)
  //
  //   const { document } = new JSDOM(response.payload).window
  //
  //   expect(getPersons).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Smith' })
  //   expect(document.location.href).toBe(routes.postcodeLookupCreate.get)
  // })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
