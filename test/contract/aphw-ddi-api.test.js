const { ddiIndexApiProvider } = require('./mockServices')

const { countriesTests } = require('./describe/api/countries')
const { cdoTests } = require('./describe/api/cdo')
const { personsTests } = require('./describe/api/persons')
const { dogsTests } = require('./describe/api/dogs')

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

  describe('/persons', () => personsTests(ddiIndexApiProvider))

  describe('/dogs', () => dogsTests(ddiIndexApiProvider))

  afterEach(async () => {
    await ddiIndexApiProvider.verify()
  })

  afterAll(async () => {
    await ddiIndexApiProvider.finalize()
  })
})
