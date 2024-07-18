const { auth, user } = require('../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const { statsPerStatusRows, statsPerCountryRows } = require('../../../../mocks/statistics')

describe('Statistics route', () => {
  jest.mock('../../../../../app/auth')
  const mockAuth = require('../../../../../app/auth')

  jest.mock('../../../../../app/api/ddi-index-api/statistics')
  const { getStatistics } = require('../../../../../app/api/ddi-index-api/statistics')

  jest.mock('../../../../../app/lib/date-helpers')
  const { getStatsTimestamp } = require('../../../../../app/lib/date-helpers')

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

  test('GET /admin/statistics route returns 200', async () => {
    getStatistics
      .mockResolvedValueOnce(statsPerStatusRows)
      .mockResolvedValueOnce(statsPerCountryRows)
    getStatsTimestamp.mockReturnValue('12am, 14 June 2024')

    const options = {
      method: 'GET',
      url: '/admin/statistics',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(getStatistics).toHaveBeenCalledTimes(2)
    expect(response.statusCode).toBe(200)
    expect(document.querySelectorAll('h1.govuk-heading-l')[0].textContent.trim()).toBe('Dogs on the Index')
    expect(document.querySelector('#main-content').textContent).toContain('Data accurate at 12am, 14 June 2024 (today).')
    expect(document.querySelectorAll('.govuk-table th')[0].textContent.trim()).toBe('Breed')
    expect(document.querySelectorAll('.govuk-table th')[1].textContent.trim()).toBe('England')
    expect(document.querySelectorAll('.govuk-table th')[2].textContent.trim()).toBe('Wales')
    expect(document.querySelectorAll('.govuk-table th')[3].textContent.trim()).toBe('Scotland')
    expect(document.querySelectorAll('.govuk-table th')[4].textContent.trim()).toBe('Total')

    expect(document.querySelectorAll('.govuk-table th')[5].textContent.trim()).toBe('XL Bully')
    expect(document.querySelectorAll('.govuk-table th')[6].textContent.trim()).toBe('Breed 2')
    expect(document.querySelectorAll('.govuk-table th')[7].textContent.trim()).toBe('Breed 3')
    expect(document.querySelectorAll('.govuk-table th')[8].textContent.trim()).toBe('Total')

    expect(document.querySelectorAll('.govuk-table th')[9].textContent.trim()).toBe('Status')
    expect(document.querySelectorAll('.govuk-table th')[10].textContent.trim()).toBe('Number')

    const rows = document.querySelectorAll('.govuk-table__body .govuk-table__row')
    expect(rows.length).toBe(12)
    expect(rows[0].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('XL Bully')
    expect(rows[0].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('55')
    expect(rows[0].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('2')
    expect(rows[0].querySelectorAll('.govuk-table__cell')[2].textContent.trim()).toBe('Not held')

    expect(rows[1].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('Breed 2')
    expect(rows[1].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('257')
    expect(rows[1].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('44')
    expect(rows[1].querySelectorAll('.govuk-table__cell')[2].textContent.trim()).toBe('10')

    expect(rows[2].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('Breed 3')
    expect(rows[2].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('128')
    expect(rows[2].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('15')
    expect(rows[2].querySelectorAll('.govuk-table__cell')[2].textContent.trim()).toBe('33')

    expect(rows[4].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('Interim exempt')
    expect(rows[4].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('20')
    expect(rows[5].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('Pre-exempt')
    expect(rows[5].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('30')
    expect(rows[6].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('Failed')
    expect(rows[6].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('40')
    expect(rows[7].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('Exempt')
    expect(rows[7].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('5,000')
    expect(rows[8].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('In breach')
    expect(rows[8].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('60')
    expect(rows[9].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('Withdrawn')
    expect(rows[9].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('70')
    expect(rows[10].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('Inactive')
    expect(rows[10].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('1,000')
    expect(rows[11].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('Total')
    expect(rows[11].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('6,220')
  })
})
