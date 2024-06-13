const { auth, user } = require('../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Statistics route', () => {
  jest.mock('../../../../../app/auth')
  const mockAuth = require('../../../../../app/auth')

  jest.mock('../../../../../app/api/ddi-index-api/statistics')
  const { getStatistics } = require('../../../../../app/api/ddi-index-api/statistics')

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

  const statsRows = [
    { total: 20, status: { id: 4, name: 'Interim exempt' } },
    { total: 30, status: { id: 5, name: 'Pre-exempt' } },
    { total: 40, status: { id: 6, name: 'Failed' } },
    { total: 5000, status: { id: 7, name: 'Exempt' } },
    { total: 60, status: { id: 8, name: 'In breach' } },
    { total: 70, status: { id: 9, name: 'Withdrawn' } },
    { total: 1000, status: { id: 10, name: 'Inactive' } }
  ]

  test('GET /admin/statistics route returns 200', async () => {
    getStatistics.mockResolvedValue(statsRows)

    const options = {
      method: 'GET',
      url: '/admin/statistics',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(getStatistics).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(200)
    expect(document.querySelectorAll('h1.govuk-heading-l')[0].textContent.trim()).toBe('Dogs on the Index')
    expect(document.querySelectorAll('.govuk-table th')[0].textContent.trim()).toBe('Status')
    expect(document.querySelectorAll('.govuk-table th')[1].textContent.trim()).toBe('Number')

    const rows = document.querySelectorAll('.govuk-table__body .govuk-table__row')
    expect(rows.length).toBe(8)
    expect(rows[0].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('Interim exempt')
    expect(rows[0].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('20')
    expect(rows[1].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('Pre-exempt')
    expect(rows[1].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('30')
    expect(rows[2].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('Failed')
    expect(rows[2].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('40')
    expect(rows[3].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('Exempt')
    expect(rows[3].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('5,000')
    expect(rows[4].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('In breach')
    expect(rows[4].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('60')
    expect(rows[5].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('Withdrawn')
    expect(rows[5].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('70')
    expect(rows[6].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('Inactive')
    expect(rows[6].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('1,000')
    expect(rows[7].querySelectorAll('.govuk-table__header')[0].textContent.trim()).toBe('Total')
    expect(rows[7].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('6,220')
  })
})
