const { auth, user, standardAuth } = require('../../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const FormData = require('form-data')

describe('Add police officer page', () => {
  jest.mock('../../../../../../../app/auth')
  const mockAuth = require('../../../../../../../app/auth')

  jest.mock('../../../../../../../app/session/admin/police-users')
  const {
    initialisePoliceUsers,
    appendPoliceUserToAdd,
    getPoliceUsersToAdd,
    setPoliceUsersToAdd,
    removePoliceUserToAdd,
    changePoliceUserToAdd
  } = require('../../../../../../../app/session/admin/police-users')

  jest.mock('../../../../../../../app/api/ddi-index-api/users')
  const { addUsers, getUsers } = require('../../../../../../../app/api/ddi-index-api/users')

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

  describe('What is the police officer\'s email page', () => {
    getPoliceUsersToAdd.mockReturnValue([])

    describe('GET /admin/users/police/add', () => {
      test('should return a 200', async () => {
        const options = {
          method: 'GET',
          url: '/admin/users/police/add',
          auth
        }

        const response = await server.inject(options)

        const { document } = new JSDOM(response.payload).window

        expect(response.statusCode).toBe(200)
        expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('What is the police officer’s email address?')
        expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Add police officer')
        expect(initialisePoliceUsers).not.toHaveBeenCalled()
      })

      test('should return a 403 given user is standard user', async () => {
        const options = {
          method: 'GET',
          url: '/admin/users/police/add',
          auth: standardAuth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(403)
      })

      test('should return to auth 302 if not auth', async () => {
        const fd = new FormData()

        const options = {
          method: 'GET',
          url: '/admin/users/police/add',
          headers: fd.getHeaders(),
          payload: fd.getBuffer()
        }

        const response = await server.inject(options)
        expect(response.statusCode).toBe(302)
      })
    })

    describe('POST /admin/users/police/add', () => {
      test('should returns 400 with empty payload', async () => {
        const options = {
          method: 'POST',
          url: '/admin/users/police/add',
          auth,
          payload: {}
        }

        const response = await server.inject(options)
        const { document } = new JSDOM(response.payload).window

        expect(response.statusCode).toBe(400)
        expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('What is the police officer’s email address?')
        expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Add police officer')
        expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Enter a police officer')
      })

      test('should returns 409 with police conflict', async () => {
        getUsers.mockResolvedValue([
          {
            id: 1,
            username: 'nicholas.angel@sandford.police.uk'
          },
          {
            id: 2,
            username: 'danny.butterman@sandford.police.uk'
          }
        ])
        const options = {
          method: 'POST',
          url: '/admin/users/police/add',
          auth,
          payload: {
            policeUser: 'nicholas.angel@sandford.police.uk'
          }
        }

        const response = await server.inject(options)
        const { document } = new JSDOM(response.payload).window

        expect(response.statusCode).toBe(400)
        expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('What is the police officer’s email address?')
        expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Add police officer')
        expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('This police officer already has access')
      })

      test('should returns 409 with police conflict with mixed case', async () => {
        getUsers.mockResolvedValue([
          {
            id: 1,
            username: 'Nicholas.Angel@sandford.Police.uk'
          },
          {
            id: 2,
            username: 'danny.butterman@sandford.police.uk'
          }
        ])
        const options = {
          method: 'POST',
          url: '/admin/users/police/add',
          auth,
          payload: {
            policeUser: 'nicholas.angel@sandford.police.uk'
          }
        }

        const response = await server.inject(options)
        const { document } = new JSDOM(response.payload).window

        expect(response.statusCode).toBe(400)
        expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('What is the police officer’s email address?')
        expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Add police officer')
        expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('This police officer already has access')
      })

      test('should return a 403 given user is standard user', async () => {
        const options = {
          method: 'POST',
          url: '/admin/users/police/add',
          auth: standardAuth,
          payload: {
            policeUser: 'nicholas.angel@sandford.police.uk'
          }
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(403)
      })

      test('should return to auth 302 if not auth', async () => {
        const fd = new FormData()

        const options = {
          method: 'POST',
          url: '/admin/users/police/add',
          headers: fd.getHeaders(),
          payload: fd.getBuffer()
        }

        const response = await server.inject(options)
        expect(response.statusCode).toBe(302)
      })

      test('should update session and redirect given valid email address submitted', async () => {
        getUsers.mockResolvedValue([])

        const options = {
          method: 'POST',
          url: '/admin/users/police/add',
          auth,
          payload: {
            policeUser: 'nicholas.angel@sandford.police.uk'
          }
        }
        const response = await server.inject(options)

        expect(appendPoliceUserToAdd).toHaveBeenCalledWith(expect.anything(), 'nicholas.angel@sandford.police.uk')
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toContain('/admin/users/police/add/list')
      })

      test('should update value for session and redirect given valid email address submitted', async () => {
        getUsers.mockResolvedValue(['ralph@wreckit.com', 'nicholas.angel@sandford.police.uk'])

        const options = {
          method: 'POST',
          url: '/admin/users/police/add',
          auth,
          payload: {
            policeUser: 'ralph@wreck-it.com',
            policeUserIndex: '0'
          }
        }
        const response = await server.inject(options)

        expect(appendPoliceUserToAdd).not.toHaveBeenCalled()
        expect(changePoliceUserToAdd).toHaveBeenCalledWith(expect.anything(), 0, 'ralph@wreck-it.com')
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toContain('/admin/users/police/add/list')
      })

      test('should not update session and redirect given duplicate email address submitted', async () => {
        getPoliceUsersToAdd.mockReturnValue(['nicholas.angel@sandford.police.uk'])

        const options = {
          method: 'POST',
          url: '/admin/users/police/add',
          auth,
          payload: {
            policeUser: 'nicholas.angel@sandford.police.uk'
          }
        }
        const response = await server.inject(options)
        const { document } = new JSDOM(response.payload).window

        expect(response.statusCode).toBe(400)
        expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('This police officer\'s details have already been entered')
        expect(appendPoliceUserToAdd).not.toHaveBeenCalled()
      })

      test('should not update session and redirect given duplicate email address submitted with mixed case', async () => {
        getPoliceUsersToAdd.mockReturnValue(['nicholas.angel@sandford.police.uk'])

        const options = {
          method: 'POST',
          url: '/admin/users/police/add',
          auth,
          payload: {
            policeUser: 'Nicholas.ANGEL@sandford.police.uk'
          }
        }
        const response = await server.inject(options)
        const { document } = new JSDOM(response.payload).window

        expect(response.statusCode).toBe(400)
        expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('This police officer\'s details have already been entered')
        expect(appendPoliceUserToAdd).not.toHaveBeenCalled()
      })
    })

    describe('GET /admin/users/police/update/1', () => {
      test('should return a 200 and clears session when called first time', async () => {
        getPoliceUsersToAdd.mockReturnValue([
          'ralph@wreckit.com',
          'nicholas.angel@sandford.police.uk'
        ])
        const options = {
          method: 'GET',
          url: '/admin/users/police/add/update/1',
          auth
        }

        const response = await server.inject(options)

        const { document } = new JSDOM(response.payload).window

        expect(response.statusCode).toBe(200)
        expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('What is the police officer’s email address?')
        expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Add police officer')
        expect(document.querySelector('input#hidden-field').getAttribute('value')).toBe('1')
        expect(document.querySelector('input#hidden-field').getAttribute('name')).toBe('policeUserIndex')
      })

      test('should return a 403 given user is standard user', async () => {
        const options = {
          method: 'GET',
          url: '/admin/users/police/add/update/1',
          auth: standardAuth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(403)
      })

      test('should return a 403 given user is standard user', async () => {
        getPoliceUsersToAdd.mockReturnValue([
          'ralph@wreckit.com',
          'nicholas.angel@sandford.police.uk'
        ])
        const options = {
          method: 'GET',
          url: '/admin/users/police/add/update/1',
          auth: standardAuth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(403)
      })
    })

    describe('POST /admin/users/police/update/1', () => {
      test('should update user and redirect to list page if user is valid', async () => {
        getPoliceUsersToAdd.mockReturnValue([
          'ralph@wreckit.com',
          'nicholas.angel@sandford.police.uk'
        ])
        const options = {
          method: 'POST',
          url: '/admin/users/police/add/update/1',
          payload: {
            policeUser: 'ralph@wreck-it.com',
            policeUserIndex: '0'
          },
          auth
        }

        const response = await server.inject(options)
        expect(response.statusCode).toBe(302)
        expect(appendPoliceUserToAdd).not.toHaveBeenCalled()
        expect(changePoliceUserToAdd).toHaveBeenCalledWith(expect.anything(), 0, 'ralph@wreck-it.com')
        expect(response.headers.location).toContain('/admin/users/police/add/list')
      })

      test('should return a 403 given user is standard user', async () => {
        const options = {
          method: 'POST',
          url: '/admin/users/police/add/update/1',
          payload: {
            policeUser: 'ralph@wreck-it.com',
            policeUserIndex: '0'
          },
          auth: standardAuth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(403)
      })

      test('should return to auth 302 if not auth', async () => {
        const fd = new FormData()

        const options = {
          method: 'POST',
          url: '/admin/users/police/add/update/1',
          headers: fd.getHeaders(),
          payload: fd.getBuffer()
        }

        const response = await server.inject(options)
        expect(response.statusCode).toBe(302)
      })
      test('should return 400 when update user not entered', async () => {
        getPoliceUsersToAdd.mockReturnValue([
          'ralph@wreckit.com',
          'nicholas.angel@sandford.police.uk'
        ])
        const options = {
          method: 'POST',
          url: '/admin/users/police/add/update/1',
          payload: {
            policeUser: '',
            policeUserIndex: '1'
          },
          auth
        }

        const response = await server.inject(options)
        const { document } = new JSDOM(response.payload).window
        expect(response.statusCode).toBe(400)
        expect(changePoliceUserToAdd).not.toHaveBeenCalled()
        expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Enter a police officer\'s email address')
      })

      test('should return 400 when update user who exists in session', async () => {
        getPoliceUsersToAdd.mockReturnValue([
          'ralph@wreckit.com',
          'nicholas.angel@sandford.police.uk'
        ])
        const options = {
          method: 'POST',
          url: '/admin/users/police/add/update/1',
          payload: {
            policeUser: 'ralph@wreckit.com',
            policeUserIndex: '1'
          },
          auth
        }

        const response = await server.inject(options)
        const { document } = new JSDOM(response.payload).window
        expect(response.statusCode).toBe(400)
        expect(changePoliceUserToAdd).not.toHaveBeenCalled()
        expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('This police officer\'s details have already been entered')
      })

      test('should return 400 when update user who exists in DB', async () => {
        getUsers.mockResolvedValue([
          {
            id: 1,
            username: 'james@giantpeach.com'
          },
          {
            id: 2,
            username: 'danny.butterman@sandford.police.uk'
          }
        ])
        getPoliceUsersToAdd.mockReturnValue([
          'ralph@wreckit.com',
          'nicholas.angel@sandford.police.uk'
        ])
        const options = {
          method: 'POST',
          url: '/admin/users/police/add/update/1',
          payload: {
            policeUser: 'james@giantpeach.com',
            policeUserIndex: '1'
          },
          auth
        }

        const response = await server.inject(options)
        const { document } = new JSDOM(response.payload).window
        expect(response.statusCode).toBe(400)
        expect(changePoliceUserToAdd).not.toHaveBeenCalled()
        expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('This police officer already has access')
      })
    })
  })

  describe('You have added x police officers page', () => {
    describe('GET /admin/users/police/add/list', () => {
      test('should return a 200 given one users have been submitted', async () => {
        getPoliceUsersToAdd.mockReturnValue(['name.lastname@police.uk'])

        const options = {
          method: 'GET',
          url: '/admin/users/police/add/list',
          auth
        }

        const response = await server.inject(options)
        const { document } = new JSDOM(response.payload).window

        expect(response.statusCode).toBe(200)
        expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('You have added 1 police officer')
        expect(document.querySelectorAll('.govuk-summary-list__key')[0].textContent.trim()).toBe('name.lastname@police.uk')
        expect(document.querySelector('#main-content').textContent.trim()).toContain('Do you need to add another police officer?')
        expect(document.querySelector('#main-content').textContent.trim()).toContain('Yes')
        expect(document.querySelector('#main-content').textContent.trim()).toContain('No')
        expect(document.querySelectorAll('.govuk-summary-list__key')[0].textContent.trim()).toBe('name.lastname@police.uk')
        expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Continue')
      })

      test('should return a 200 given three users have been submitted', async () => {
        getPoliceUsersToAdd.mockReturnValue([
          'nicholas.angel@sandford.police.uk',
          'danny.butterman@sandford.police.uk',
          'axel.foley@beverly-hills.police.gov'
        ])

        const options = {
          method: 'GET',
          url: '/admin/users/police/add/list',
          auth
        }

        const response = await server.inject(options)

        const { document } = new JSDOM(response.payload).window

        expect(response.statusCode).toBe(200)
        expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('You have added 3 police officers')
        expect(document.querySelectorAll('.govuk-summary-list__key')[0].textContent.trim()).toBe('nicholas.angel@sandford.police.uk')
        expect(document.querySelectorAll('.govuk-summary-list__key')[1].textContent.trim()).toBe('danny.butterman@sandford.police.uk')
        expect(document.querySelectorAll('.govuk-summary-list__key')[2].textContent.trim()).toBe('axel.foley@beverly-hills.police.gov')
        expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Continue')
      })
    })

    describe('POST /admin/users/police/add/list', () => {
      test('should redirect to confirmation page if No is selected', async () => {
        getPoliceUsersToAdd.mockReturnValue([
          'nicholas.angel@sandford.police.uk',
          'danny.butterman@sandford.police.uk'
        ])

        const options = {
          method: 'POST',
          url: '/admin/users/police/add/list',
          payload: {
            continue: '',
            addAnother: 'N',
            users: [
              'nicholas.angel@sandford.police.uk',
              'danny.butterman@sandford.police.uk'
            ]
          },
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/admin/users/police/add/confirm')
        expect(setPoliceUsersToAdd).toHaveBeenCalledWith(expect.anything(), [
          'nicholas.angel@sandford.police.uk',
          'danny.butterman@sandford.police.uk'
        ])
      })

      test('should redirect to add a user if Yes is selected', async () => {
        getPoliceUsersToAdd.mockReturnValue([
          'nicholas.angel@sandford.police.uk',
          'danny.butterman@sandford.police.uk'
        ])

        const options = {
          method: 'POST',
          url: '/admin/users/police/add/list',
          payload: {
            continue: '',
            addAnother: 'Y',
            users: [
              'nicholas.angel@sandford.police.uk',
              'danny.butterman@sandford.police.uk'
            ]
          },
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/admin/users/police/add')
        expect(setPoliceUsersToAdd).toHaveBeenCalledWith(expect.anything(), [
          'nicholas.angel@sandford.police.uk',
          'danny.butterman@sandford.police.uk'
        ])
      })

      test('should return a 400 given radio has not been selected', async () => {
        getPoliceUsersToAdd.mockReturnValue(['name.lastname@police.uk'])

        const options = {
          method: 'POST',
          url: '/admin/users/police/add/list',
          payload: {
            continue: '',
            users: [
              'nicholas.angel@sandford.police.uk',
              'danny.butterman@sandford.police.uk'
            ]
          },
          auth
        }

        const response = await server.inject(options)
        const { document } = new JSDOM(response.payload).window

        expect(response.statusCode).toBe(400)
        expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('You have added 1 police officer')
        expect(document.querySelectorAll('.govuk-summary-list__key')[0].textContent.trim()).toBe('name.lastname@police.uk')
        expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Continue')
        expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Select an option')
      })

      test('should fail with a 400 if users are empty', async () => {
        getPoliceUsersToAdd.mockReturnValue([])

        const options = {
          method: 'POST',
          url: '/admin/users/police/add/list',
          payload: {
            continue: '',
            addAnother: 'N',
            users: []
          },
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(400)
        const { document } = new JSDOM(response.payload).window

        expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('You have added 0 police officers')
        expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Continue')
        expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('There must be at least one police officer')
      })
    })

    describe('GET /admin/users/polices/add/remove/1', () => {
      test('should remove user when more than one user', async () => {
        getPoliceUsersToAdd.mockReturnValue([
          'nicholas.angel@sandford.police.uk',
          'danny.butterman@sandford.police.uk'
        ])
        removePoliceUserToAdd.mockReturnValue(['nicholas.angel@sandford.police.uk'])
        const options = {
          method: 'GET',
          url: '/admin/users/police/add/remove/1',
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/admin/users/police/add/list')
        expect(removePoliceUserToAdd).toHaveBeenCalledWith(expect.anything(), 1)
      })

      test('should remove user when only one user', async () => {
        getPoliceUsersToAdd.mockReturnValue([
          'nicholas.angel@sandford.police.uk'
        ])
        removePoliceUserToAdd.mockReturnValue([])
        const options = {
          method: 'GET',
          url: '/admin/users/police/add/remove/0',
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/admin/users/police')
        expect(removePoliceUserToAdd).toHaveBeenCalledWith(expect.anything(), 0)
      })
    })
  })

  describe('Check your answers page', () => {
    describe('GET /admin/users/police/add/confirm', () => {
      test('should show the confirmation page', async () => {
        getPoliceUsersToAdd.mockReturnValue([
          'nicholas.angel@sandford.police.uk',
          'danny.butterman@sandford.police.uk'
        ])

        const options = {
          method: 'GET',
          url: '/admin/users/police/add/confirm',
          auth
        }

        const response = await server.inject(options)
        const { document } = new JSDOM(response.payload).window

        expect(response.statusCode).toBe(200)
        expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Check your answers before giving the police officers access')
        expect(document.querySelectorAll('.govuk-summary-list__key')[0].textContent.trim()).toBe('nicholas.angel@sandford.police.uk')
        expect(document.querySelectorAll('.govuk-summary-list__key')[1].textContent.trim()).toBe('danny.butterman@sandford.police.uk')
        expect(document.querySelector('#main-content h2.govuk-heading-m').textContent.trim()).toBe('Now give access')
        expect(document.querySelector('#main-content').textContent.trim()).toContain('Police officers will receive an email inviting them to access the Dangerous Dogs Index.')
        expect(document.querySelector('#main-content .govuk-grid-column-three-quarters .govuk-button').textContent.trim()).toContain('Give access')
      })
    })

    describe('POST /admin/users/police/add/confirm', () => {
      test('should fail with a 400 given 0 users submitted', async () => {
        getPoliceUsersToAdd.mockReturnValue([])

        const options = {
          method: 'POST',
          url: '/admin/users/police/add/confirm',
          payload: {
            continue: '',
            users: []
          },
          auth
        }

        const response = await server.inject(options)
        const { document } = new JSDOM(response.payload).window

        expect(response.statusCode).toBe(400)
        expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Check your answers before giving the police officers access')
        expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('There must be at least one police officer')
      })
    })
  })

  describe('Success page', () => {
    describe('POST /admin/users/police/add/confirm', () => {
      test('should show success page', async () => {
        const users = [
          'nicholas.angel@sandford.police.uk',
          'danny.butterman@sandford.police.uk'
        ]
        getPoliceUsersToAdd.mockReturnValue(users)
        addUsers.mockResolvedValue({
          users: {
            success: users,
            failures: []
          }
        })

        const options = {
          method: 'POST',
          url: '/admin/users/police/add/confirm',
          payload: {
            continue: '',
            users
          },
          auth
        }

        const response = await server.inject(options)
        const { document } = new JSDOM(response.payload).window

        expect(response.statusCode).toBe(200)
        expect(document.querySelector('.govuk-panel__title').textContent.trim()).toBe('You gave police officers access to the Index')
        expect(document.querySelector('#main-content h2.govuk-heading-m').textContent.trim()).toBe('What happens next')
        expect(document.querySelector('#main-content').textContent.trim()).toContain('These police officers will receive an email invitation to access the Dangerous Dogs Index:')
        expect(document.querySelectorAll('.govuk-list li')[0].textContent.trim()).toBe('nicholas.angel@sandford.police.uk')
        expect(document.querySelectorAll('.govuk-list li')[1].textContent.trim()).toBe('danny.butterman@sandford.police.uk')
        expect(addUsers).toHaveBeenCalledWith(users, user)
        expect(initialisePoliceUsers).toHaveBeenCalled()
      })
    })
  })
})
