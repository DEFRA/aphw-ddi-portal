const { admin } = require('../../../../../../app/auth/permissions')
const { JSDOM } = require('jsdom')

describe('View dog details', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  const createServer = require('../../../../../../app/server')
  let server

  const auth = { strategy: 'session-auth', credentials: { scope: [admin] } }

  const user = {
    userId: '1',
    username: 'test@example.com'
  }

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/view/dog-details route returns 200', async () => {
    getCdo.mockResolvedValue({
      id: 1,
      name: 'Bruno',
      status: { status: 'TEST' },
      dog_breed: { breed: 'breed1' },
      registered_person: [{
        person: {
          firstName: 'John Smith',
          addresses: [{
            address: {
            }
          }]
        }
      }],
      insurance: [{
        id: 3,
        policy_number: 'POL12345',
        company: {
          company_name: 'Dogs Trust'
        }
      }]
    })

    const options = {
      method: 'GET',
      url: '/cdo/view/dog-details/ED123',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelectorAll('dd').length).toBe(19)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
