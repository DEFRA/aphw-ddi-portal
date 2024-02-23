const path = require('path')
const { Pact } = require('@pact-foundation/pact')
const Matchers = require('@pact-foundation/pact/dsl/matchers')
let countriesApi
let provider

const consumerName = 'aphw-ddi-portal'
const providerName = 'aphw-ddi-api'
describe('Schedule contract test', () => {
  beforeAll(async () => {
    provider = new Pact({
      consumer: consumerName,
      provider: providerName,
      port: 1234,
      log: path.resolve(process.cwd(), 'test-output', 'pact.log'),
      dir: path.resolve(process.cwd(), 'test-output')
    })
    await provider.setup()
    const mockApiService = provider.mockService
    jest.mock('../../app/config', () => ({
      ddiIndexApi: mockApiService
    }))
    countriesApi = require('../../app/api/ddi-index-api/countries')
  })

  test('GET /countries', async () => {
    await provider.addInteraction({
      state: 'countries exist',
      uponReceiving: 'get all countries',
      withRequest: {
        method: 'GET',
        path: '/countries'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: {
          countries: Matchers.eachLike('England', null)
        }
      }
    })

    const response = await countriesApi.getCountries()
    expect(response[0]).toEqual('England')
  })

  afterEach(async () => {
    await provider.verify()
  })

  afterAll(async () => {
    await provider.finalize()
  })
})
