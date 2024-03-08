const { ddiIndexApiProvider } = require('./mockServices')
const { userWithDisplayname } = require('../mocks/auth')
const { validCdoRequest, validCdoRequestWithCountry, validCdoRequestWithPersonReference } = require('./matchers/cdo')
const CdoCreatedViewModel = require('../../app/models/cdo/create/record-created')

const {
  getCountriesInteraction
} = require('./interactions/api/countries')

const {
  postCdoWithoutCountryInteraction,
  postCdoWithCountryInteraction, postCdoWithOwnerLookupInteraction
} = require('./interactions/api/cdo')

describe('API service contract tests', () => {
  beforeAll(async () => {
    const mockService = ddiIndexApiProvider
    await mockService.setup()
    jest.mock('../../app/config', () => ({
      ddiIndexApi: mockService.mockService
    }))
  })

  describe('/countries', () => {
    describe('GET /countries', () => {
      let countriesApi

      beforeAll(() => {
        countriesApi = require('../../app/api/ddi-index-api/countries')
      })

      test('GET /countries', async () => {
        await ddiIndexApiProvider.addInteraction(getCountriesInteraction)

        const response = await countriesApi.getCountries()
        expect(response[0]).toEqual('England')
      })
    })
  })

  describe('/cdo', () => {
    let cdoApi

    beforeAll(() => {
      cdoApi = require('../../app/api/ddi-index-api/cdo')
    })

    test('POST /cdo with mandatory data', async () => {
      await ddiIndexApiProvider.addInteraction(postCdoWithoutCountryInteraction)

      const response = await cdoApi.createCdo(validCdoRequest, userWithDisplayname)
      expect(() => CdoCreatedViewModel(response)).not.toThrow()
    })

    test('POST /cdo with optional data including country', async () => {
      await ddiIndexApiProvider.addInteraction(postCdoWithCountryInteraction)

      const response = await cdoApi.createCdo(validCdoRequestWithCountry, userWithDisplayname)
      expect(() => CdoCreatedViewModel(response)).not.toThrow()
    })

    test('POST /cdo with person reference', async () => {
      await ddiIndexApiProvider.addInteraction(postCdoWithOwnerLookupInteraction)

      const response = await cdoApi.createCdo(validCdoRequestWithPersonReference, userWithDisplayname)
      expect(() => CdoCreatedViewModel(response)).not.toThrow()
    })
  })

  describe('/activity', () => {
    let activityApi

    beforeAll(() => {
      activityApi = require('../../app/api/ddi-index-api/activities')
    })

    test('POST /activity with mandatory data', async () => {
      getActivityById.mockResolvedValue({ activity_event: { target_primary_key: 'owner' } })
      getDogOwner.mockResolvedValue({ personReference: 'p-123' })
      await ddiIndexApiProvider.addInteraction({
        state: 'activity has mandatory data',
        uponReceiving: 'submission to POST activity data',
        withRequest: {
          method: 'POST',
          path: '/activity',
          body: validActivityRequest,
          headers
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: validActivityResponseMatcher
        }
      })

      const response = await activityApi.recordActivity(validActivityRequest, userWithDisplayname)
      expect(response).toBe('ok')
    })
  })
  /*
  describe('/activities', () => {
    let activitiesApi

    beforeAll(() => {
      activitiesApi = require('../../app/api/ddi-index-api/activities')
    })

    test('GET /activities', async () => {
      await ddiIndexApiProvider.addInteraction({
        state: 'activities list exists',
        uponReceiving: 'get all activities',
        withRequest: {
          method: 'GET',
          path: '/activities'
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

      const response = await activitiesApi.getActivityById()
      expect(response[0]).toEqual('England')
    })
  })
  */
  afterEach(async () => {
    await ddiIndexApiProvider.verify()
  })

  afterAll(async () => {
    await ddiIndexApiProvider.finalize()
  })
})
