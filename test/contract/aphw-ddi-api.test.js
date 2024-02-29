const Matchers = require('@pact-foundation/pact/dsl/matchers')
const { ddiIndexApiProvider } = require('./mockServices')
const { valid: validCdo, validWithCountry } = require('../mocks/cdo/createPayload')
const { userWithDisplayname } = require('../mocks/auth')
const { validCdoMatcher, validCdoMatcherWithCountry } = require('./matchers/cdo')
const CdoCreatedViewModel = require('../../app/models/cdo/create/record-created')
describe('API service contract test', () => {
  describe('/countries', () => {
    let countriesApi

    beforeAll(async () => {
      const mockService = ddiIndexApiProvider
      await mockService.setup()
      jest.mock('../../app/config', () => ({
        ddiIndexApi: mockService.mockService
      }))
    })

    describe('GET /countries', () => {
      beforeAll(() => {
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

    describe('/cdo', () => {
      let cdoApi

      beforeAll(() => {
        cdoApi = require('../../app/api/ddi-index-api/cdo')
      })

      test('POST /cdo with mandatory data', async () => {
        await ddiIndexApiProvider.addInteraction({
          state: 'cdo has only mandatory data',
          uponReceiving: 'submission to POST cdo data',
          withRequest: {
            method: 'POST',
            path: '/cdo'
          },
          willRespondWith: {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            },
            body: validCdoMatcher
          }
        })

        const response = await cdoApi.createCdo(validCdo, userWithDisplayname)
        expect(() => CdoCreatedViewModel(response)).not.toThrow()
      })

      test('POST /cdo with optional data including country', async () => {
        await ddiIndexApiProvider.addInteraction({
          state: 'cdo includes optional data and country',
          uponReceiving: 'submission to POST cdo data',
          withRequest: {
            method: 'POST',
            path: '/cdo'
          },
          willRespondWith: {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            },
            body: validCdoMatcherWithCountry
          }
        })

        const response = await cdoApi.createCdo(validWithCountry, userWithDisplayname)
        expect(() => CdoCreatedViewModel(response)).not.toThrow()
      })
    })
  })

  afterEach(async () => {
    await ddiIndexApiProvider.verify()
  })

  afterAll(async () => {
    await ddiIndexApiProvider.finalize()
  })
})
