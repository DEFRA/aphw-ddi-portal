const { getCountriesInteraction } = require('../../interactions/api/countries')
const { user } = require('../../../mocks/auth')

const countriesTests = (ddiIndexApiProvider) => {
  let countriesApi

  beforeAll(() => {
    countriesApi = require('../../../../app/api/ddi-index-api/countries')
  })

  test('GET /countries', async () => {
    await ddiIndexApiProvider.addInteraction(getCountriesInteraction)

    const response = await countriesApi.getCountries(user)
    expect(response[0]).toEqual('England')
  })
}

module.exports = {
  countriesTests
}
