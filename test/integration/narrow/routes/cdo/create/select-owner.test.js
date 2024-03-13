const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const { routes } = require('../../../../../../app/constants/cdo/owner')
const { routes: dogRoutes } = require('../../../../../../app/constants/cdo/dog')
const FormData = require('form-data')

describe('OwnerResults test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/persons')
  const { getPersons } = require('../../../../../../app/api/ddi-index-api/persons')

  jest.mock('../../../../../../app/session/cdo/owner')
  const { setOwnerDetails, getOwnerDetails, setAddress } = require('../../../../../../app/session/cdo/owner')

  jest.mock('../../../../../../app/session/session-wrapper')
  const { setInSession, getFromSession } = require('../../../../../../app/session/session-wrapper')

  const createServer = require('../../../../../../app/server')
  let server
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

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/select-owner route returns 302 given no persons found', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/select-owner',
      auth
    }
    getPersons.mockResolvedValue([])
    getOwnerDetails.mockReturnValue({
      firstName: 'John',
      lastName: 'Smith'
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(routes.postcodeLookupCreate.get)
  })

  test('GET /cdo/create/select-owner route returns 200 given one person found', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/select-owner',
      auth
    }

    getPersons.mockResolvedValue([resolvedPerson])
    getOwnerDetails.mockReturnValue({
      firstName: 'John',
      lastName: 'Smith'
    })

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = new JSDOM(response.payload).window

    expect(setInSession).toBeCalledWith(expect.anything(), 'persons', [resolvedPerson])
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

    getPersons.mockResolvedValue(resolvedPersons)
    getOwnerDetails.mockReturnValue({ firstName: 'Jack', lastName: 'Jones' })

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = new JSDOM(response.payload).window

    expect(setAddress).not.toHaveBeenCalled()

    expect(setInSession).toBeCalledWith(expect.anything(), 'persons', resolvedPersons)
    expect(document.querySelector('h1').textContent).toBe('Select the address for Jack Jones')
    expect(document.querySelectorAll('form .govuk-radios__item label')[0].textContent.trim()).toContain('Bully Green Farm, Snow Hill, Sudbury CO10 8QX')
    expect(document.querySelectorAll('form .govuk-radios__item .govuk-radios__input')[0].getAttribute('value')).toBe('0')
    expect(document.querySelectorAll('form .govuk-radios__item label')[1].textContent.trim()).toContain('5 Station Road, Woofferton, Ludlow SY8 4NL')
    expect(document.querySelectorAll('form .govuk-radios__item .govuk-radios__input')[1].getAttribute('value')).toBe('1')
    expect(document.querySelectorAll('form .govuk-radios__item label')[2].textContent.trim()).toContain("The owner's address is not listed")
    expect(document.querySelectorAll('form .govuk-radios__item .govuk-radios__input')[2].getAttribute('value')).toBe('-1')
    expect(document.querySelector('.govuk-grid-row form .govuk-button').textContent.trim()).toBe('Continue')
  })

  test('POST /cdo/create/select-owner route returns 302 if not auth', async () => {
    const fd = new FormData()

    const options = {
      method: 'POST',
      url: '/cdo/create/select-owner',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/create/select-owner with empty data returns error', async () => {
    const options = {
      method: 'POST',
      url: '/cdo/create/select-owner',
      auth,
      payload: {}
    }

    getFromSession.mockReturnValue(resolvedPersons)
    getOwnerDetails.mockReturnValue({ firstName: 'Jack', lastName: 'Jones' })

    const response = await server.inject(options)
    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(document.querySelector('.govuk-error-summary__list')).not.toBeNull()
    expect(document.querySelectorAll('.govuk-error-summary__list a').length).toBe(1)
    expect(document.querySelectorAll('.govuk-error-summary__list a')[0].textContent.trim()).toBe('Select an address')
    expect(document.querySelector('h1').textContent).toBe('Select the address for Jack Jones')
    expect(document.querySelectorAll('form .govuk-radios__item label')[0].textContent.trim()).toContain('Bully Green Farm, Snow Hill, Sudbury CO10 8QX')
  })

  test('POST /cdo/create/select-owner with valid data returns 302', async () => {
    const payload = {
      address: '0'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/select-owner',
      auth,
      payload
    }

    getFromSession.mockReturnValue([resolvedPerson])
    getOwnerDetails.mockReturnValue({
      firstName: 'Joe',
      lastName: 'Bloggs'
    })

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(setOwnerDetails).toBeCalledWith(expect.anything(), resolvedPerson)
    expect(setAddress).toBeCalledWith(expect.anything(), {
      addressLine2: 'Snow Hill',
      country: 'England',
      postcode: 'CO10 8QX',
      town: 'Sudbury',
      addressLine1: 'Bully Green Farm'
    })
    expect(response.headers.location).toBe(dogRoutes.microchipSearch.get)
    // expect(document.querySelector('.govuk-error-summary__list')).not.toBeNull()
    // expect(document.querySelectorAll('.govuk-error-summary__list a').length).toBe(1)
    // expect(document.querySelectorAll('.govuk-error-summary__list a')[0].textContent.trim()).toBe('Select an option')
  })

  test('POST /cdo/create/select-owner with valid data returns 302 given owners address not listed', async () => {
    const payload = {
      address: '-1'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/select-owner',
      auth,
      payload
    }

    getFromSession.mockReturnValue(resolvedPersons)
    getOwnerDetails.mockReturnValue({
      firstName: 'Joe',
      lastName: 'Bloggs'
    })

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(setOwnerDetails).not.toHaveBeenCalled()
    expect(setAddress).not.toHaveBeenCalled()

    expect(response.headers.location).toBe(routes.postcodeLookupCreate.get)
    // expect(document.querySelector('.govuk-error-summary__list')).not.toBeNull()
    // expect(document.querySelectorAll('.govuk-error-summary__list a').length).toBe(1)
    // expect(document.querySelectorAll('.govuk-error-summary__list a')[0].textContent.trim()).toBe('Select an option')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
