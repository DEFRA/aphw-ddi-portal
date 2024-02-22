const { auth, user } = require('../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('View regular jobs', () => {
  jest.mock('../../../../../app/auth')
  const mockAuth = require('../../../../../app/auth')

  jest.mock('../../../../../app/api/ddi-index-api/regular-jobs')
  const { getRegularJobs } = require('../../../../../app/api/ddi-index-api/regular-jobs')

  const createServer = require('../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  const jobRows = [
    {
      id: 3,
      start_time: new Date(2024, 1, 3, 11),
      end_time: new Date(2024, 1, 3, 11, 30),
      result: 'Success3'
    },
    {
      id: 2,
      start_time: new Date(2024, 1, 2, 11),
      end_time: new Date(2024, 1, 2, 11, 30),
      result: 'Success2'
    },
    {
      id: 1,
      start_time: new Date(2024, 1, 1, 11),
      end_time: new Date(2024, 1, 1, 11, 30),
      result: 'Success1'
    }
  ]

  test('GET /admin/regular-jobs route returns 200', async () => {
    getRegularJobs.mockResolvedValue(jobRows)

    const options = {
      method: 'GET',
      url: '/admin/regular-jobs',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(getRegularJobs).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(200)
    expect(document.querySelectorAll('h1.govuk-heading-l')[0].textContent.trim()).toBe('Regular jobs')
    expect(document.querySelectorAll('.govuk-table th')[0].textContent.trim()).toBe('Id')
    expect(document.querySelectorAll('.govuk-table th')[1].textContent.trim()).toBe('Start time')
    expect(document.querySelectorAll('.govuk-table th')[2].textContent.trim()).toBe('End time')
    expect(document.querySelectorAll('.govuk-table th')[3].textContent.trim()).toBe('Result')

    const rows = document.querySelectorAll('.govuk-table__body .govuk-table__row')
    expect(rows.length).toBe(3)
    expect(rows[0].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('3')
    expect(rows[0].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('Sat Feb 03 2024 11:00:00 GMT+0000 (Greenwich Mean Time)')
    expect(rows[0].querySelectorAll('.govuk-table__cell')[2].textContent.trim()).toBe('Sat Feb 03 2024 11:30:00 GMT+0000 (Greenwich Mean Time)')
    expect(rows[0].querySelectorAll('.govuk-table__cell')[3].textContent.trim()).toBe('Success3')
    expect(rows[1].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('2')
    expect(rows[1].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('Fri Feb 02 2024 11:00:00 GMT+0000 (Greenwich Mean Time)')
    expect(rows[1].querySelectorAll('.govuk-table__cell')[2].textContent.trim()).toBe('Fri Feb 02 2024 11:30:00 GMT+0000 (Greenwich Mean Time)')
    expect(rows[1].querySelectorAll('.govuk-table__cell')[3].textContent.trim()).toBe('Success2')
    expect(rows[2].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('1')
    expect(rows[2].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('Thu Feb 01 2024 11:00:00 GMT+0000 (Greenwich Mean Time)')
    expect(rows[2].querySelectorAll('.govuk-table__cell')[2].textContent.trim()).toBe('Thu Feb 01 2024 11:30:00 GMT+0000 (Greenwich Mean Time)')
    expect(rows[2].querySelectorAll('.govuk-table__cell')[3].textContent.trim()).toBe('Success1')
  })
})
