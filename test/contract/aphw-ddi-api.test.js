const { ddiIndexApiProvider } = require('./mockServices')
const { countriesTests } = require('./aphw-ddi-api/countries-tests')
const { cdoTests } = require('./aphw-ddi-api/cdo-tests')
const { activitiesTests } = require('./aphw-ddi-api/activities-tests')
const { activityGetTests } = require('./aphw-ddi-api/activity-get-tests')
const { activityPostTests } = require('./aphw-ddi-api/activity-post-tests')
const { personsTests } = require('./aphw-ddi-api/persons-tests')

describe('API service contract tests', () => {
  beforeAll(async () => {
    const mockService = ddiIndexApiProvider
    await mockService.setup()
    jest.mock('../../app/config', () => ({
      ddiIndexApi: mockService.mockService
    }))
  })

  describe('/countries', () => countriesTests(ddiIndexApiProvider))

  describe('/cdo', () => cdoTests(ddiIndexApiProvider))

  describe('/activities', () => activitiesTests(ddiIndexApiProvider))

  describe('/activity get', () => activityGetTests(ddiIndexApiProvider))

  describe('/activity post', () => activityPostTests(ddiIndexApiProvider))

  describe('/persons', () => personsTests(ddiIndexApiProvider))

  afterEach(async () => {
    await ddiIndexApiProvider.verify()
  })

  afterAll(async () => {
    await ddiIndexApiProvider.finalize()
  })
})
