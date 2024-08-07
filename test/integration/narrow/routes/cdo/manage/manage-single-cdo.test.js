const { auth, user } = require('../../../../../mocks/auth')
jest.mock('../../../../../../app/session/session-wrapper')
const { setInSession } = require('../../../../../../app/session/session-wrapper')
const { JSDOM } = require('jsdom')
jest.mock('../../../../../../app/api/ddi-index-api/search')
const { noTasksStartedYet, someTasksCompletedButNotYetAvailable } = require('../../../../../mocks/cdo/manage/cdo')

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

  test('GET /cdo/manage/cdo/ED123 route returns 200', async () => {
    getCdo.mockResolvedValue({
      dog: {
        indexNumber: 'ED20001'
      },
      person: {
        personReference: 'P-A133-7E4C'
      },
      exemption: {
        cdoExpiry: new Date('2024-04-19')
      }
    })
    getManageCdoDetails.mockResolvedValue(noTasksStartedYet)

    const options = {
      method: 'GET',
      url: '/cdo/manage/cdo/ED123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('h1.govuk-heading-xl').textContent.trim()).toBe('Dog ED20001')
    expect(document.querySelector('span.govuk-body.defra-secondary-text').textContent.trim()).toBe('CDO expires on 19 April 2024')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[0].textContent.trim()).toBe('Send application pack')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[1].textContent.trim()).toBe('Not yet started')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[3].textContent.trim()).toBe('Record insurance details')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[4].textContent.trim()).toBe('Cannot start yet')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[6].textContent.trim()).toBe('Record microchip number')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[7].textContent.trim()).toBe('Cannot start yet')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[9].textContent.trim()).toBe('Record application fee payment')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[10].textContent.trim()).toBe('Cannot start yet')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[12].textContent.trim()).toBe('Send Form 2')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[13].textContent.trim()).toBe('Cannot start yet')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[15].textContent.trim()).toBe('Record the verification date for microchip and neutering')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[16].textContent.trim()).toBe('Cannot start yet')
  })

  test('GET /cdo/manage/cdo/ED123 route returns 200 with completed tasks overriding "Cannot start yet"', async () => {
    getCdo.mockResolvedValue({
      dog: {
        indexNumber: 'ED20001'
      },
      person: {
        personReference: 'P-A133-7E4C'
      },
      exemption: {
        cdoExpiry: new Date('2024-04-19')
      }
    })
    getManageCdoDetails.mockResolvedValue(someTasksCompletedButNotYetAvailable)

    const options = {
      method: 'GET',
      url: '/cdo/manage/cdo/ED123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('h1.govuk-heading-xl').textContent.trim()).toBe('Dog ED20001')
    expect(document.querySelector('span.govuk-body.defra-secondary-text').textContent.trim()).toBe('CDO expires on 19 April 2024')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[0].textContent.trim()).toBe('Send application pack')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[1].textContent.trim()).toBe('Not yet started')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[2].textContent.trim()).toBe('Record insurance details')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[3].textContent.trim()).toBe('Completed on 01 Feb 2024')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[4].textContent.trim()).toBe('Record microchip number')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[5].textContent.trim()).toBe('Completed on 03 Mar 2024')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[6].textContent.trim()).toBe('Record application fee payment')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[7].textContent.trim()).toBe('Completed on 02 Mar 2024')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[8].textContent.trim()).toBe('Send Form 2')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[9].textContent.trim()).toBe('Completed on 03 Apr 2024')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[10].textContent.trim()).toBe('Record the verification date for microchip and neutering')
    expect(document.querySelectorAll('ul.govuk-task-list li div')[11].textContent.trim()).toBe('Completed on 10 Apr 2024')
  })

  test('GET /cdo/manage/cdo/ED123 route returns 404 when invalid index number', async () => {
    getCdo.mockResolvedValue({
      dog: {
        indexNumber: 'ED20001'
      },
      person: {
        personReference: 'P-A133-7E4C'
      },
      exemption: {
        cdoExpiry: new Date('2024-04-19')
      }
    })
    getManageCdoDetails.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: '/cdo/manage/cdo/ED123',
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
