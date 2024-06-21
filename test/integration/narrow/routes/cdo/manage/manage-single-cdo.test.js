const { auth, user } = require('../../../../../mocks/auth')
jest.mock('../../../../../../app/session/session-wrapper')
const { setInSession } = require('../../../../../../app/session/session-wrapper')
const { JSDOM } = require('jsdom')
jest.mock('../../../../../../app/api/ddi-index-api/search')
const { noTasksStartedYet } = require('../../../../../mocks/cdo/manage/cdo')

describe('Manage Cdo test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo, getManageCdoDetails } = require('../../../../../../app/api/ddi-index-api/cdo')

  const createServer = require('../../../../../../app/server')
  let server

  setInSession.mockReturnValue()

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/manage-cdo/ED123 route returns 200', async () => {
    getCdo.mockResolvedValue({
      dog: {
        indexNumber: 'ED20001'
      },
      peson: {
        personReference: 'P-A133-7E4C'
      },
      exemption: {
        cdoExpiry: new Date('2024-04-19')
      }
    })
    getManageCdoDetails.mockResolvedValue(noTasksStartedYet)

    const options = {
      method: 'GET',
      url: '/cdo/manage-cdo/ED123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('h1.govuk-heading-l').textContent.trim()).toBe('Manage CDOs')
    expect(document.querySelector('ul[data-testid="tab-navigation"]')).not.toBeNull()
    expect(document.querySelectorAll('.govuk-tabs__list-item')[0].textContent.trim()).toBe('Live CDOs')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
