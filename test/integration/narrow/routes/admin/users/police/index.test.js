const { auth, user, standardAuth } = require('../../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const FormData = require('form-data')
const { buildUser } = require('../../../../../../mocks/users')
const { buildPoliceForce } = require('../../../../../../mocks/policeForces')
const { sort } = require('../../../../../../../app/constants/api')

describe('Police users page', () => {
  jest.mock('../../../../../../../app/auth')
  const mockAuth = require('../../../../../../../app/auth')

  jest.mock('../../../../../../../app/api/ddi-index-api/users')
  const { getUsers } = require('../../../../../../../app/api/ddi-index-api/users')

  jest.mock('../../../../../../../app/api/ddi-index-api/police-forces')
  const { getPoliceForces } = require('../../../../../../../app/api/ddi-index-api/police-forces')

  const createServer = require('../../../../../../../app/server')
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

  describe('/admin/users/police', () => {
    test('GET /admin/users/police route returns 200', async () => {
      const options = {
        method: 'GET',
        url: '/admin/users/police',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('.govuk-fieldset__heading').textContent.trim()).toBe('Do you want to add or remove police officers?')
      expect(document.querySelectorAll('.govuk-radios__label')[0].textContent.trim()).toContain('Add')
      expect(document.querySelectorAll('.govuk-radios__label')[1].textContent.trim()).toContain('Remove')
      expect(document.querySelector('.govuk-back-link').getAttribute('href')).toBe('/admin/index')
    })

    test('GET /admin/users/police route returns 403 given user is standard user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/users/police',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })

    test('POST /admin/users/police add police user route returns 200', async () => {
      const options = {
        method: 'POST',
        url: '/admin/users/police',
        auth,
        payload: {
          addOrRemove: 'add'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/users/police/add')
    })

    test('POST /admin/users/police remove police user route returns 200', async () => {
      const options = {
        method: 'POST',
        url: '/admin/users/police',
        auth,
        payload: {
          addOrRemove: 'remove'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/users/police/remove')
    })

    test('POST /admin/users/police without an option returns 400', async () => {
      const options = {
        method: 'POST',
        url: '/admin/users/police',
        auth,
        payload: {}
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window
      expect(document.querySelector('.govuk-fieldset__heading').textContent.trim()).toBe('Do you want to add or remove police officers?')
      expect(response.statusCode).toBe(400)
    })

    test('POST /admin/users/police route returns 302 if not auth', async () => {
      const fd = new FormData()

      const options = {
        method: 'POST',
        url: '/admin/users/police',
        headers: fd.getHeaders(),
        payload: fd.getBuffer()
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })
  })

  describe('/admin/police/list', () => {
    const userList = {
      users: [
        buildUser({
          id: 1,
          username: 'robocop@dallas.police.gov',
          policeForceId: 1,
          policeForce: 'Dallas Police Department',
          accepted: new Date('2024-11-12T00:00:00.000Z'),
          active: true,
          createdAt: new Date('2024-11-12T00:00:00.000Z'),
          lastLogin: new Date('2024-11-12T00:00:00.000Z'),
          activated: new Date('2024-11-12T00:00:00.000Z')
        }),
        buildUser({
          id: 2,
          username: 'unactivated.user@anytown.police.uk',
          policeForce: 'Anytown Police Department',
          policeForceId: 2
        }),
        buildUser({
          id: 3,
          username: 'internal@example.com',
          policeForceId: undefined,
          policeForce: undefined,
          accepted: new Date('2024-11-12T00:00:00.000Z'),
          active: true,
          createdAt: new Date('2024-11-12T00:00:00.000Z'),
          lastLogin: new Date('2024-11-12T00:00:00.000Z'),
          activated: new Date('2024-11-12T00:00:00.000Z')
        })
      ],
      count: 3
    }

    const userListSingle = {
      users: [
        buildUser({
          id: 1,
          username: 'robocop@dallas.police.gov',
          policeForceId: 1,
          policeForce: 'Dallas Police Department',
          accepted: new Date('2024-11-12T00:00:00.000Z'),
          active: true,
          createdAt: new Date('2024-11-12T00:00:00.000Z'),
          lastLogin: new Date('2024-11-12T00:00:00.000Z'),
          activated: new Date('2024-11-12T00:00:00.000Z')
        })
      ],
      count: 1
    }

    getPoliceForces.mockResolvedValue([buildPoliceForce({})])

    test('should get unfiltered list of police users', async () => {
      getUsers.mockResolvedValue(userList)
      const options = {
        method: 'GET',
        url: '/admin/users/police/list',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(getUsers).toHaveBeenCalledWith({}, expect.anything())
      expect(document.querySelector('.govuk-fieldset__legend--l').textContent.trim()).toBe('Police officer access to the Index')
      const mainContent = document.querySelector('#main-content')
      expect(mainContent.textContent).toContain('Officers by police force')
      expect(mainContent.querySelector('.govuk-button').textContent.trim()).toBe('Select police force')
      const table = document.querySelector('.govuk-table')
      expect(table.textContent).toContain('Email address')
      expect(table.textContent).toContain('Police force')
      expect(table.textContent).toContain('Index access')
      expect(document.querySelector('#main-content h2.govuk-heading-m').textContent.trim()).toBe('3 police officers')
      const rows = table.querySelectorAll('tbody .govuk-table__row')

      const [email1, policeForce1, indexAccess1] = rows[0].querySelectorAll('.govuk-table__cell')
      const [email2, policeForce2, indexAccess2] = rows[1].querySelectorAll('.govuk-table__cell')
      const [email3, policeForce3, indexAccess3] = rows[2].querySelectorAll('.govuk-table__cell')
      expect(email1.textContent.trim()).toBe('robocop@dallas.police.gov')
      expect(email2.textContent.trim()).toBe('unactivated.user@anytown.police.uk')
      expect(email3.textContent.trim()).toBe('internal@example.com')
      expect(policeForce1.textContent.trim()).toBe('Dallas Police Department')
      expect(policeForce2.textContent.trim()).toBe('Anytown Police Department')
      expect(policeForce3.textContent.trim()).toBe('')
      expect(indexAccess1.textContent.trim()).toBe('Yes')
      expect(indexAccess2.textContent.trim()).toBe('Invite sent')
      expect(indexAccess3.textContent.trim()).toBe('Yes')
      expect(getPoliceForces).toHaveBeenCalled()
    })

    test('should filter police users and show single user correctly', async () => {
      getUsers.mockResolvedValue(userListSingle)
      const options = {
        method: 'GET',
        url: '/admin/users/police/list?policeForce=3',
        auth
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(getUsers).toHaveBeenCalledWith({ filter: { policeForceId: 3 } }, expect.anything())

      expect(document.querySelector('#main-content h2.govuk-heading-m').textContent.trim()).toBe('1 police officer')
    })

    test('should not filter police users if empty', async () => {
      getUsers.mockResolvedValue(userList)
      const options = {
        method: 'GET',
        url: '/admin/users/police/list?policeForce=',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      expect(getUsers).toHaveBeenCalledWith({}, expect.anything())
    })

    test('should not filter police users if search all', async () => {
      getUsers.mockResolvedValue(userList)
      const options = {
        method: 'GET',
        url: '/admin/users/police/list?policeForce=-1',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      expect(getUsers).toHaveBeenCalledWith({}, expect.anything())
    })

    test('should sort by email ascending', async () => {
      getUsers.mockResolvedValue(userList)
      const options = {
        method: 'GET',
        url: '/admin/users/police/list?sortKey=email',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      expect(getUsers).toHaveBeenCalledWith({ sort: { username: sort.ASC } }, expect.anything())
    })

    test('should sort by email descending', async () => {
      getUsers.mockResolvedValue(userList)
      const options = {
        method: 'GET',
        url: '/admin/users/police/list?sortKey=email&sortOrder=DESC',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      expect(getUsers).toHaveBeenCalledWith({ sort: { username: sort.DESC } }, expect.anything())
    })

    test('should sort by policeForce ascending', async () => {
      getUsers.mockResolvedValue(userList)
      const options = {
        method: 'GET',
        url: '/admin/users/police/list?sortKey=policeForce&sortOrder=ASC',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      expect(getUsers).toHaveBeenCalledWith({ sort: { policeForce: sort.ASC } }, expect.anything())
    })

    test('should sort by policeForce descending', async () => {
      getUsers.mockResolvedValue(userList)
      const options = {
        method: 'GET',
        url: '/admin/users/police/list?sortKey=policeForce&sortOrder=DESC',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      expect(getUsers).toHaveBeenCalledWith({ sort: { policeForce: sort.DESC } }, expect.anything())
    })

    test('should sort by indexAccess ascending', async () => {
      getUsers.mockResolvedValue(userList)
      const options = {
        method: 'GET',
        url: '/admin/users/police/list?sortKey=indexAccess&sortOrder=ASC',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      expect(getUsers).toHaveBeenCalledWith({ sort: { indexAccess: false } }, expect.anything())
    })

    test('should sort by indexAccess descending', async () => {
      getUsers.mockResolvedValue(userList)
      const options = {
        method: 'GET',
        url: '/admin/users/police/list?sortKey=indexAccess&sortOrder=DESC',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      expect(getUsers).toHaveBeenCalledWith({ sort: { indexAccess: true } }, expect.anything())
    })

    test('should not permit invalid query strings', async () => {
      const options = {
        method: 'GET',
        url: '/admin/users/police/list?sortKey=unknown',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(400)
    })

    test('should not succeed for standard users', async () => {
      const options = {
        method: 'GET',
        url: '/admin/users/police/list',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })
  })
})
