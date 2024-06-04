const { adminAuth, standardAuth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Delete dogs 2', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/admin/delete-dogs')
  const { getDogsForDeletion, setDogsForDeletion } = require('../../../../../../app/session/admin/delete-dogs')

  jest.mock('../../../../../../app/api/ddi-index-api/dogs')
  const { getOldDogs } = require('../../../../../../app/api/ddi-index-api/dogs')

  const createServer = require('../../../../../../app/server')
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

  const dogSelections = ['ED0003', 'ED0002', 'ED0001']

  const dogRows = [
    {
      indexNumber: 'ED0003',
      dateOfBirth: new Date(2020, 1, 3),
      cdoIssued: new Date(2024, 4, 28),
      status: { status: 'Exempt' }
    },
    {
      indexNumber: 'ED0002',
      dateOfBirth: new Date(2021, 2, 4),
      cdoIssued: new Date(2024, 3, 27),
      status: { status: 'Exempt' }
    },
    {
      indexNumber: 'ED0001',
      dateOfBirth: new Date(2022, 5, 8),
      cdoIssued: new Date(2024, 1, 1),
      status: { status: 'Exempt' }
    }
  ]

  describe('GET /admin/delete/dogs-2 route', () => {
    test('returns 200', async () => {
      getOldDogs.mockResolvedValue(dogRows)
      getDogsForDeletion.mockReturnValue(dogSelections)

      const options = {
        method: 'GET',
        url: '/admin/delete/dogs-2',
        auth: adminAuth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelectorAll('h1.govuk-heading-l')[0].textContent.trim()).toBe('Check the list and select the dog records you want to delete')
      expect(document.querySelectorAll('.govuk-table th')[0].textContent.trim()).toBe('Status')
      expect(document.querySelectorAll('.govuk-table th')[1].textContent.trim()).toBe('Index number')
      expect(document.querySelectorAll('.govuk-table th')[2].textContent.trim()).toBe('Date of birth')
      expect(document.querySelectorAll('.govuk-table th')[3].textContent.trim()).toBe('CDO issued')
      expect(document.querySelectorAll('.govuk-table th')[4].textContent.trim()).toBe('Delete dog record')

      const rows = document.querySelectorAll('.govuk-table__body .govuk-table__row')
      expect(rows.length).toBe(3)
      expect(rows[0].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('Exempt')
      expect(rows[0].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('ED0003')
      expect(rows[0].querySelectorAll('.govuk-table__cell')[2].textContent.trim()).toBe('03 February 2020')
      expect(rows[0].querySelectorAll('.govuk-table__cell')[3].textContent.trim()).toBe('28 May 2024')
      expect(rows[1].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('Exempt')
      expect(rows[1].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('ED0002')
      expect(rows[1].querySelectorAll('.govuk-table__cell')[2].textContent.trim()).toBe('04 March 2021')
      expect(rows[1].querySelectorAll('.govuk-table__cell')[3].textContent.trim()).toBe('27 April 2024')
      expect(rows[2].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('Exempt')
      expect(rows[2].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('ED0001')
      expect(rows[2].querySelectorAll('.govuk-table__cell')[2].textContent.trim()).toBe('08 June 2022')
      expect(rows[2].querySelectorAll('.govuk-table__cell')[3].textContent.trim()).toBe('01 February 2024')
    })

    test('handles date override', async () => {
      getOldDogs.mockResolvedValue(dogRows)

      const options = {
        method: 'GET',
        url: '/admin/delete/dogs-2?today=2050-01-01',
        auth: adminAuth
      }

      const response = await server.inject(options)

      expect(getOldDogs).toHaveBeenCalledWith('In breach,Pre-exempt,Interim exempt', { column: 'status', order: 'ASC' }, '2050-01-01')
      expect(response.statusCode).toBe(200)
    })

    test('returns 302 when not authd', async () => {
      getOldDogs.mockResolvedValue(dogRows)
      getDogsForDeletion.mockReturnValue(dogSelections)

      const options = {
        method: 'GET',
        url: '/admin/delete/dogs-2'
      }

      const response = await server.inject(options)

      expect(getOldDogs).not.toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(302)
    })

    test('returns 403 when not an admin user', async () => {
      getOldDogs.mockResolvedValue(dogRows)
      getDogsForDeletion.mockReturnValue(dogSelections)

      const options = {
        method: 'GET',
        url: '/admin/delete/dogs-2',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(getOldDogs).not.toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(403)
    })
  })

  describe('POST /admin/delete/dogs-2 route', () => {
    test('returns 302', async () => {
      setDogsForDeletion.mockReturnValue()
      const options = {
        method: 'POST',
        url: '/admin/delete/dogs-2',
        auth: adminAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/delete/dogs-confirm')
    })

    test('returns 302 for sorting', async () => {
      setDogsForDeletion.mockReturnValue()
      const options = {
        method: 'POST',
        url: '/admin/delete/dogs-2',
        auth: adminAuth,
        payload: { checkboxSortOnly: 'Y' }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/delete/dogs-2?sortKey=selected&sortOrder=ASC')
    })

    test('returns 302 when not authd', async () => {
      const options = {
        method: 'POST',
        url: '/admin/delete/dogs-2'
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
    })

    test('returns 403 when not admin user', async () => {
      const options = {
        method: 'POST',
        url: '/admin/delete/dogs-2',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })
  })
})
