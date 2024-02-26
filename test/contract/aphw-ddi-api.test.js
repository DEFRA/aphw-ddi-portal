const Matchers = require('@pact-foundation/pact/dsl/matchers')
const { ddiIndexApiProvider } = require('./mockServices')
let countriesApi

describe('API service contract test', () => {
  describe('/countries', () => {
    beforeAll(async () => {
      const mockService = ddiIndexApiProvider
      await mockService.setup()
      jest.mock('../../app/config', () => ({
        ddiIndexApi: mockService.mockService
      }))
      countriesApi = require('../../app/api/ddi-index-api/countries')
    })

    test('GET /countries', async () => {
      await ddiIndexApiProvider.addInteraction({
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
  })

  afterEach(async () => {
    await ddiIndexApiProvider.verify()
  })

  afterAll(async () => {
    await ddiIndexApiProvider.finalize()
  })
})
