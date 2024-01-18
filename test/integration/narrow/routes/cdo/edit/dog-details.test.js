const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Update dog details', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/dog-breeds')
  const { getBreeds } = require('../../../../../../app/api/ddi-index-api/dog-breeds')

  jest.mock('../../../../../../app/api/ddi-index-api/dog')
  const { getDogDetails, updateDogDetails } = require('../../../../../../app/api/ddi-index-api/dog')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    getBreeds.mockResolvedValue({
      breeds: [
        { breed: 'breed1' },
        { breed: 'breed2' },
        { breed: 'breed3' }
      ]
    })

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/edit/dog-details/P-1234-5678 route returns 200', async () => {
    getDogDetails.mockResolvedValue({
      name: 'Bruno',
      dog_breed: { breed: 'breed1' }
    })

    const options = {
      method: 'GET',
      url: '/cdo/edit/dog-details/P-1234-5678',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/edit/dog-details/P-1234-5678 route returns 404 when dog not found', async () => {
    getDogDetails.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: '/cdo/edit/dog-details/P-1234-5678',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  test('POST /cdo/edit/dog-details route returns 302', async () => {
    updateDogDetails.mockResolvedValue()
    const payload = {
      id: 1,
      indexNumber: 'ED123',
      name: 'Bruno',
      breed: 'breed1'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/dog-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(updateDogDetails).toHaveBeenCalledTimes(1)
  })

  test('POST /cdo/edit/dog-details route returns 400 when payload is invalid', async () => {
    updateDogDetails.mockResolvedValue()
    const options = {
      method: 'POST',
      url: '/cdo/edit/dog-details',
      auth,
      payload: {}
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updateDogDetails).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()
  })

  test('POST /cdo/edit/dog-details with invalid date of birth returns 400', async () => {
    updateDogDetails.mockResolvedValue()
    const payload = {
      dogId: 1,
      indexNumber: 'ED123',
      name: 'Bruno',
      breed: 'breed1',
      'dateOfBirth-day': '40',
      'dateOfBirth-month': '1',
      'dateOfBirth-year': '1980'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/dog-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updateDogDetails).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('Enter a real date')
  })

  test('POST /cdo/edit/dog-details with missing month and year returns 400', async () => {
    updateDogDetails.mockResolvedValue()
    const payload = {
      dogId: 1,
      indexNumber: 'ED123',
      name: 'Bruno',
      breed: 'breed1',
      'dateOfBirth-day': '1',
      'dateOfBirth-month': '',
      'dateOfBirth-year': ''
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/dog-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updateDogDetails).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
    expect(messages).toContain('A date must include a month and year')
  })

  test('POST /cdo/edit/dog-details with short year returns 400', async () => {
    updateDogDetails.mockResolvedValue()
    const payload = {
      dogId: 1,
      indexNumber: 'ED123',
      name: 'Bruno',
      breed: 'breed1',
      'dateOfBirth-day': '1',
      'dateOfBirth-month': '2',
      'dateOfBirth-year': '26'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/dog-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updateDogDetails).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
    expect(messages).toContain('Enter a 4-digit year')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
