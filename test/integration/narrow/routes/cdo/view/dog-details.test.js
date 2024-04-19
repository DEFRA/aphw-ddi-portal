const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('View dog details', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/view/dog-details returns 200', () => {
    getCdo.mockResolvedValue({
      dog: {
        id: 1,
        indexNumber: 'ED123',
        name: 'Bruno',
        status: { status: 'TEST' },
        dog_breed: { breed: 'breed1' }
      },
      person: {
        firstName: 'John Smith',
        addresses: [{
          address: {
          }
        }],
        person_contacts: []
      },
      exemption: {
        exemptionOrder: 2015,
        insurance: [{
          company: 'Dogs Trust'
        }]
      }
    })

    test('GET /cdo/view/dog-details route returns 200 given standard', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/view/dog-details/ED123',
        auth: standardAuth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1').textContent.trim()).toBe('Dog ED123')
      expect(document.querySelectorAll('.govuk-summary-list__value')[0].textContent.trim()).toBe('Bruno')
      expect(document.querySelectorAll('.govuk-summary-list__value')[1].textContent.trim()).toBe('John Smith')
      expect(document.querySelectorAll('.govuk-summary-list__value')[3].textContent.trim()).toBe('Dogs Trust')
      expect(document.querySelectorAll('.govuk-grid-column-one-half .govuk-button')[0].textContent.trim()).toBe('Add an activity')
      expect(document.querySelectorAll('.govuk-grid-column-one-half .govuk-button')[1].textContent.trim()).toBe('Check activity')
      expect(document.querySelector('.govuk-button[data-testid="delete-dog-record-btn"]')).toBeNull()
    })

    test('GET /cdo/view/dog-details route returns 200 given admin user', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/view/dog-details/ED123',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('.govuk-button[data-testid="delete-dog-record-btn"]').textContent.trim()).toBe('Delete dog record')
      expect(document.querySelector('.govuk-button[data-testid="delete-dog-record-btn"]').getAttribute('href')).toContain('/cdo/delete/dog/ED123?src=')
    })
  })

  test('GET /cdo/view/dog-details route returns 404 if no data found', async () => {
    getCdo.mockResolvedValue(undefined)

    const options = {
      method: 'GET',
      url: '/cdo/view/dog-details/ED123',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
