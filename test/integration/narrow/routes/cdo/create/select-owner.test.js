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
    expect(document.querySelector('.govuk-grid-row form').textContent).not.toContain('England')
    expect(document.querySelector('.govuk-grid-row form .govuk-button').textContent.trim()).toBe('Confirm address')
    expect(document.querySelector('.govuk-grid-row form .govuk-link').textContent).toBe('Change address')
    expect(document.querySelector('.govuk-grid-row form .govuk-link').getAttribute('href')).toBe(routes.address.get)
  })

  test('GET /cdo/create/select-owner route returns 200 given more than one person found', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/select-owner',
      auth
    }

    /**
     * @type {import('../../../../../../app/api/ddi-index-api/person').Person[]}
     */
    const resolvedPersons = [
      {
        birthDate: '',
        contacts: undefined,
        firstName: 'Jack',
        lastName: 'Jones',
        personReference: 'P-123-456',
        address: {
          addressLine2: 'Snow Hill',
          country: 'England',
          postcode: 'CO10 8QX',
          town: 'Sudbury',
          addressLine1: 'Bully Green Farm'
        }
      },
      {
        birthDate: '',
        contacts: undefined,
        firstName: 'Jack',
        lastName: 'Jones',
        personReference: 'P-123-457',
        address: {
          addressLine1: '5 Station Road',
          addressLine2: 'Woofferton',
          country: 'England',
          postcode: 'SY8 4NL',
          town: 'Ludlow'
        }
      }
    ]

    getPersons.mockResolvedValue(resolvedPersons)
    getOwnerDetails.mockReturnValue({ firstName: 'Jack', lastName: 'Jones' })

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = new JSDOM(response.payload).window

    expect(setAddress).not.toHaveBeenCalled()

    expect(document.querySelector('h1').textContent).toBe('Select the address for Jack Jones')
    expect(document.querySelectorAll('form .govuk-radios__item label')[0].textContent.trim()).toContain('Bully Green Farm, Snow Hill, Sudbury CO10 8QX')
    expect(document.querySelectorAll('form .govuk-radios__item .govuk-radios__input')[0].getAttribute('value')).toBe('P-123-456')
    expect(document.querySelectorAll('form .govuk-radios__item label')[1].textContent.trim()).toContain('5 Station Road, Woofferton, Ludlow SY8 4NL')
    expect(document.querySelectorAll('form .govuk-radios__item .govuk-radios__input')[1].getAttribute('value')).toBe('P-123-457')
    expect(document.querySelectorAll('form .govuk-radios__item label')[2].textContent.trim()).toContain("The owner's address is not listed")
    expect(document.querySelector('.govuk-grid-row form .govuk-button').textContent.trim()).toBe('Continue')
  })

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
