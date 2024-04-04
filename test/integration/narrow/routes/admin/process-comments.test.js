const { auth, user } = require('../../../../mocks/auth')

describe('View regular jobs', () => {
  jest.mock('../../../../../app/auth')
  const mockAuth = require('../../../../../app/auth')

  jest.mock('../../../../../app/api/ddi-index-api/process-comments')
  const { getProcessComments } = require('../../../../../app/api/ddi-index-api/process-comments')

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

  const commentsProcessed = {
    rowsProcessed: 50,
    rowsInError: 1,
    rowsPublishedToEvents: 49
  }

  test('GET /admin/regular-jobs route returns 200', async () => {
    getProcessComments.mockResolvedValue(commentsProcessed)

    const options = {
      method: 'GET',
      url: '/admin/process-comments',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
    expect(getProcessComments).toHaveBeenCalledWith(undefined)
  })

  test('GET /admin/regular-jobs route returns 200 given ', async () => {
    getProcessComments.mockResolvedValue(commentsProcessed)

    const options = {
      method: 'GET',
      url: '/admin/process-comments?maxRecords=10',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
    expect(getProcessComments).toHaveBeenCalledWith(10)
  })
})
