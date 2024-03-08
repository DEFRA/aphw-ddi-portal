const { ddiIndexApiProvider } = require('./mockServices')
const { userWithDisplayname } = require('../mocks/auth')
const { validCdoRequest, validCdoRequestWithCountry, validCdoRequestWithPersonReference } = require('./matchers/cdo')
const CdoCreatedViewModel = require('../../app/models/cdo/create/record-created')

const { getCountriesInteraction } = require('./interactions/api/countries')

const {
  postCdoWithoutCountryInteraction,
  postCdoWithCountryInteraction, postCdoWithOwnerLookupInteraction
} = require('./interactions/api/cdo')

const { getPersonsFirstNameLastNameInteraction, getPersonsFirstNameLastNameDOBInteraction } = require('./interactions/api/persons')

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

  describe('/persons', () => {
    let personApi

    beforeAll(() => {
      personApi = require('../../app/api/ddi-index-api/persons')
    })

    test('GET /persons with mandatory data', async () => {
      await ddiIndexApiProvider.addInteraction(getPersonsFirstNameLastNameInteraction)

      await personApi.getPersons({
        firstName: 'Homer',
        lastName: 'Simpson'
      })
    })

    test('GET /persons with optional data', async () => {
      await ddiIndexApiProvider.addInteraction(getPersonsFirstNameLastNameDOBInteraction)

      await personApi.getPersons({
        firstName: 'Homer',
        lastName: 'Simpson',
        dateOfBirth: '1998-05-10'
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
