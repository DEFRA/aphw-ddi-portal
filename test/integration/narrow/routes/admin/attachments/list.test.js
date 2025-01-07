const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Attachments list route', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/session-wrapper')
  const { setInSession } = require('../../../../../../app/session/session-wrapper')

  jest.mock('../../../../../../app/storage/repos/blob')
  const { listFiles, deleteFile, renameFile } = require('../../../../../../app/storage/repos/blob')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    setInSession.mockReturnValue()

    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  describe('GET /admin/attachments/list', () => {
    test('returns a 200 when no rows', async () => {
      listFiles.mockReturnValue([])
      const options = {
        method: 'GET',
        url: '/admin/attachments/list',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1.govuk-heading-l').textContent.trim()).toBe('Manage attachments')
      expect(document.querySelectorAll('#attachment-table td')[0].textContent.trim()).toContain('No attachments')
    })

    test('returns a 200 when some rows', async () => {
      listFiles.mockReturnValue(['filename1.pdf'])
      const options = {
        method: 'GET',
        url: '/admin/attachments/list',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1.govuk-heading-l').textContent.trim()).toBe('Manage attachments')
      expect(document.querySelectorAll('#attachment-table td')[0].textContent.trim()).toContain('filename1.pdf')
    })

    test('returns 403 given user is standard user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/attachments/list',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })
  })

  describe('POST /admin/attachments/list', () => {
    test('returns 302 with empty payload', async () => {
      const options = {
        method: 'POST',
        url: '/admin/attachments/list',
        auth,
        payload: {}
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })

    test('forwards to Test screen', async () => {
      const options = {
        method: 'POST',
        url: '/admin/attachments/list',
        auth,
        payload: { test: 'filename1.pdf' }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/attachments/test')
      expect(setInSession).toHaveBeenCalledWith(expect.anything(), 'attachmentFile', 'filename1.pdf')
    })

    test('handles Remove', async () => {
      const options = {
        method: 'POST',
        url: '/admin/attachments/list',
        auth,
        payload: { remove: 'filename1.pdf' }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/attachments/list')
      expect(deleteFile).toHaveBeenCalledWith('attachments', 'filename1.pdf')
    })

    test('handles go-live if filename not already live', async () => {
      listFiles.mockReturnValue(['filename2.pdf'])

      const options = {
        method: 'POST',
        url: '/admin/attachments/list',
        auth,
        payload: { golive: 'filename1.2024-12-12T10:00:00.001Z.draft.pdf' }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/attachments/list')
      expect(renameFile).toHaveBeenCalledWith('attachments', 'filename1.2024-12-12T10:00:00.001Z.draft.pdf', 'filename1.pdf')
    })

    test('errors during go-live if filename is already live', async () => {
      listFiles.mockReturnValue(['filename1.pdf'])

      const options = {
        method: 'POST',
        url: '/admin/attachments/list',
        auth,
        payload: { golive: 'filename1.2024-12-12T10:01:02.123Z.draft.pdf' }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(400)
      expect(renameFile).not.toHaveBeenCalled()
    })

    test('handles revoke', async () => {
      listFiles.mockReturnValue(['filename1.pdf'])

      const options = {
        method: 'POST',
        url: '/admin/attachments/list',
        auth,
        payload: { revoke: 'filename1.pdf' }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/attachments/list')
      expect(renameFile).toHaveBeenCalledWith('attachments', 'filename1.pdf', expect.anything(String))
      expect(renameFile.mock.calls[0][2]).toContain('Z.draft.pdf')
      expect(renameFile.mock.calls[0][2]).toContain('filename1.')
    })
  })
})
