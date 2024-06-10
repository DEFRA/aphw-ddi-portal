const { adminAuth, standardAuth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Delete owners', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/persons')
  const { getOrphanedOwners } = require('../../../../../../app/api/ddi-index-api/persons')

  jest.mock('../../../../../../app/session/admin/delete-owners')
  const { getOrphanedOwnersForDeletion, initialiseOwnersForDeletion, setOrphanedOwnersForDeletion } = require('../../../../../../app/session/admin/delete-owners')

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

  const ownerRows = [
    {
      firstName: 'Dick',
      lastName: 'Dastardly',
      birthDate: '1968-05-19',
      personReference: 'P-4A91-4A4D',
      address: {
        addressLine1: '10 Wacky Close',
        addressLine2: null,
        town: 'Muttley',
        postcode: 'HB2 FLY',
        country: 'England'
      }
    },
    {
      firstName: 'Abby',
      lastName: 'Breitenberg',
      birthDate: '1998-05-10',
      personReference: 'P-418F-024E',
      address: {
        addressLine1: '218 White Knoll',
        addressLine2: 'Anywhere Estate',
        town: 'Lake Keatonmouth',
        postcode: 'S1 1AA',
        country: 'England'
      }
    },
    {
      firstName: 'Samuel',
      lastName: 'Campbell',
      birthDate: '1980-04-02',
      personReference: 'P-585C-C9B5',
      address: {
        addressLine1: '54 Fallowfield',
        addressLine2: null,
        town: 'Runcorn',
        postcode: 'WA7 2NG',
        country: 'Wales'
      }
    }
  ]

  describe('GET /admin/delete/owners route', () => {
    test('returns 200 with start=true', async () => {
      getOrphanedOwners.mockResolvedValue(ownerRows)
      getOrphanedOwnersForDeletion.mockReturnValue(['P-4A91-4A4D', 'P-418F-024E', 'P-585C-C9B5'])

      const options = {
        method: 'GET',
        url: '/admin/delete/owners?start=true',
        auth: adminAuth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(getOrphanedOwners).toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(200)
      expect(document.querySelector('.govuk-caption-l').textContent.trim()).toBe('Delete dog owner records without a dog')
      expect(document.querySelector('h1.govuk-heading-l').textContent.trim()).toBe('Unselect the dog owner records you want to keep')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('These dog owner records have no dogs linked to them and should be deleted.')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('You can unselect any dog owner records you want to keep.')

      expect(document.querySelectorAll('.govuk-table th')[0].textContent.trim()).toBe('Name')
      expect(document.querySelectorAll('.govuk-table th')[1].textContent.trim()).toBe('Date of birth')
      expect(document.querySelectorAll('.govuk-table th')[2].textContent.trim()).toBe('Address')
      expect(document.querySelectorAll('.govuk-table th')[3].textContent.trim()).toBe('Delete record')

      const rows = document.querySelectorAll('.govuk-table__body .govuk-table__row')
      expect(rows.length).toBe(3)
      expect(rows[0].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('Dick Dastardly')
      expect(rows[0].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('19 May 1968')
      expect(rows[0].querySelectorAll('.govuk-table__cell')[2].textContent.trim()).toBe('10 Wacky Close, Muttley HB2 FLY')
      expect(rows[0].querySelector('.govuk-table__cell .govuk-checkboxes__input').getAttribute('value')).toBe('P-4A91-4A4D')
      expect(rows[0].querySelector('.govuk-table__cell .govuk-checkboxes__input').getAttribute('checked')).toBe('true')

      expect(rows[1].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('Abby Breitenberg')
      expect(rows[1].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('10 May 1998')
      expect(rows[1].querySelectorAll('.govuk-table__cell')[2].textContent.trim()).toBe('218 White Knoll, Lake Keatonmouth S1 1AA')
      expect(rows[1].querySelector('.govuk-table__cell .govuk-checkboxes__input').getAttribute('value')).toBe('P-418F-024E')
      expect(rows[1].querySelector('.govuk-table__cell .govuk-checkboxes__input').getAttribute('checked')).toBe('true')

      expect(rows[2].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('Samuel Campbell')
      expect(rows[2].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('02 April 1980')
      expect(rows[2].querySelectorAll('.govuk-table__cell')[2].textContent.trim()).toBe('54 Fallowfield, Runcorn WA7 2NG')
      expect(rows[2].querySelector('.govuk-table__cell .govuk-checkboxes__input').getAttribute('value')).toBe('P-585C-C9B5')
      expect(rows[2].querySelector('.govuk-table__cell .govuk-checkboxes__input').getAttribute('checked')).toBe('true')
    })

    test('returns 200', async () => {
      getOrphanedOwners.mockResolvedValue(ownerRows)
      getOrphanedOwnersForDeletion.mockReturnValue([])

      const options = {
        method: 'GET',
        url: '/admin/delete/owners',
        auth: adminAuth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(getOrphanedOwners).toHaveBeenCalledTimes(1)
      expect(initialiseOwnersForDeletion).toHaveBeenCalledTimes(0)
      expect(response.statusCode).toBe(200)

      const rows = document.querySelectorAll('.govuk-table__body .govuk-table__row')
      expect(rows.length).toBe(3)

      expect(rows[0].querySelector('.govuk-table__cell .govuk-checkboxes__input').getAttribute('checked')).toBeNull()
      expect(rows[1].querySelector('.govuk-table__cell .govuk-checkboxes__input').getAttribute('checked')).toBeNull()
      expect(rows[2].querySelector('.govuk-table__cell .govuk-checkboxes__input').getAttribute('checked')).toBeNull()
    })

    test('returns 404 when invalid param name', async () => {
      getOrphanedOwners.mockResolvedValue(ownerRows)

      const options = {
        method: 'GET',
        url: '/admin/delete/owners?invalid=true',
        auth: adminAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
      expect(initialiseOwnersForDeletion).toHaveBeenCalledTimes(0)
    })

    test('returns 302 when not authd', async () => {
      getOrphanedOwners.mockResolvedValue(ownerRows)

      const options = {
        method: 'GET',
        url: '/admin/delete/owners'
      }

      const response = await server.inject(options)

      expect(getOrphanedOwners).not.toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(302)
    })

    test('returns 403 when not an admin user', async () => {
      getOrphanedOwners.mockResolvedValue(ownerRows)

      const options = {
        method: 'GET',
        url: '/admin/delete/owners',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(getOrphanedOwners).not.toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(403)
    })
  })

  describe('POST /admin/delete/owners route', () => {
    test('should show a confirmation page', async () => {
      const ownerReferenceIds = [
        'P-418F-024E', 'P-585C-C9B5', 'P-4A91-4A4D'
      ]
      const options = {
        method: 'POST',
        url: '/admin/delete/owners',
        auth: adminAuth,
        payload: {
          deleteOwner: ownerReferenceIds
        }
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
      expect(setOrphanedOwnersForDeletion).toHaveBeenCalledWith(expect.anything(), ownerReferenceIds)
      const { document } = new JSDOM(response.payload).window

      expect(document.querySelector('h1.govuk-heading-l').textContent.trim()).toBe('You are about to delete 3 dog owner records')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('Deleted records no longer appear in search results.')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('You have 90 days to raise a support ticket to recover a deleted dog owner record.')
      const hiddenInputs = document.querySelectorAll('input[name="deleteOwner"]')
      expect(hiddenInputs.length).toBe(3)
      expect(hiddenInputs[0].getAttribute('value')).toBe('P-418F-024E')
      expect(hiddenInputs[1].getAttribute('value')).toBe('P-585C-C9B5')
      expect(hiddenInputs[2].getAttribute('value')).toBe('P-4A91-4A4D')
      expect(document.querySelector('button[name="confirm"]')).not.toBeNull()
    })

    test('should return 400 with invalid payload', async () => {
      const options = {
        method: 'POST',
        url: '/admin/delete/owners',
        auth: adminAuth,
        payload: {}
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(400)
    })

    test('should return 302 when not authd', async () => {
      const options = {
        method: 'POST',
        url: '/admin/delete/owners'
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
    })

    test('should return 403 when not admin user', async () => {
      const options = {
        method: 'POST',
        url: '/admin/delete/owners',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })
  })
})
