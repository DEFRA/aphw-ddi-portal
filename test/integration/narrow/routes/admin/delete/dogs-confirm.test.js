const { adminAuth, standardAuth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Delete dogs 2', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/admin/delete-dogs')
  const { getDogsForDeletion } = require('../../../../../../app/session/admin/delete-dogs')

  jest.mock('../../../../../../app/api/ddi-index-api/dogs')
  const { bulkDeleteDogs } = require('../../../../../../app/api/ddi-index-api/dogs')

  const createServer = require('../../../../../../app/server')
  let server

  const dogSelections1 = ['ED0003', 'ED0002', 'ED0001']
  const dogSelections2 = ['ED12345']

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    getDogsForDeletion.mockImplementation((req, step) => {
      return step === 1 ? dogSelections1 : dogSelections2
    })

    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  describe('GET /admin/delete/dogs-confirm route', () => {
    test('returns 200', async () => {
      const options = {
        method: 'GET',
        url: '/admin/delete/dogs-confirm',
        auth: adminAuth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelectorAll('h1.govuk-heading-l')[0].textContent.trim()).toBe('You are about to delete 4 dog records')
      expect(document.querySelectorAll('form .govuk-body')[0].textContent.trim()).toBe('Deleted records no longer appear in search results.')
      expect(document.querySelectorAll('form .govuk-body')[1].textContent.trim()).toBe('You have 90 days to raise a support ticket to recover a deleted dog record.')
    })

    test('returns 200 for single dog', async () => {
      const options = {
        method: 'GET',
        url: '/admin/delete/dogs-confirm',
        auth: adminAuth
      }

      getDogsForDeletion.mockImplementation((req, step) => {
        return step === 1 ? [] : dogSelections2
      })

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelectorAll('h1.govuk-heading-l')[0].textContent.trim()).toBe('You are about to delete 1 dog record')
      expect(document.querySelectorAll('form .govuk-body')[0].textContent.trim()).toBe('Deleted records no longer appear in search results.')
      expect(document.querySelectorAll('form .govuk-body')[1].textContent.trim()).toBe('You have 90 days to raise a support ticket to recover a deleted dog record.')
    })

    test('returns 200 for no dogs', async () => {
      const options = {
        method: 'GET',
        url: '/admin/delete/dogs-confirm',
        auth: adminAuth
      }

      getDogsForDeletion.mockImplementation((req, step) => {
        return []
      })

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelectorAll('h1.govuk-heading-l')[0].textContent.trim()).toBe('No records selected')
      expect(document.querySelectorAll('form .govuk-body')[0].textContent.trim()).toBe('You have not selected any records to delete.')
      expect(document.querySelectorAll('form .govuk-body')[1].textContent.trim()).toBe('You can go back and select records to delete if you need to.')
    })

    test('returns 302 when not authd', async () => {
      const options = {
        method: 'GET',
        url: '/admin/delete/dogs-confirm'
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
    })

    test('returns 403 when not an admin user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/delete/dogs-confirm',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })
  })

  describe('POST /admin/delete/dogs-confirm route', () => {
    test('returns 200', async () => {
      bulkDeleteDogs.mockResolvedValue({ count: { success: 4 } })
      const options = {
        method: 'POST',
        url: '/admin/delete/dogs-confirm',
        auth: adminAuth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelectorAll('h1.govuk-panel__title')[0].textContent.trim()).toBe('4 dog records have been deleted')
    })

    test('returns 200 with single dog', async () => {
      getDogsForDeletion.mockImplementation((req, step) => {
        return step === 1 ? [] : dogSelections2
      })
      bulkDeleteDogs.mockResolvedValue({ count: { success: 1 } })
      const options = {
        method: 'POST',
        url: '/admin/delete/dogs-confirm',
        auth: adminAuth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelectorAll('h1.govuk-panel__title')[0].textContent.trim()).toBe('1 dog record has been deleted')
    })

    test('returns 302 when not authd', async () => {
      bulkDeleteDogs.mockResolvedValue({})
      const options = {
        method: 'POST',
        url: '/admin/delete/dogs-confirm'
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
    })

    test('returns 403 when not admin user', async () => {
      bulkDeleteDogs.mockResolvedValue({})
      const options = {
        method: 'POST',
        url: '/admin/delete/dogs-confirm',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })

    test('throws error if delete fails', async () => {
      bulkDeleteDogs.mockResolvedValue({ count: { success: 2 } })
      const options = {
        method: 'POST',
        url: '/admin/delete/dogs-confirm',
        auth: adminAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(500)
    })
  })
})
