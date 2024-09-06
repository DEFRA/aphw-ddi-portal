const {
  getPersonsFirstNameLastNameInteraction,
  mandatoryGetPersonsQueryParams,
  getPersonsFirstNameLastNameDOBInteraction,
  allGetPersonsQueryParams
} = require('../../interactions/api/persons')
const { user } = require('../../../mocks/auth')

const personsTests = (ddiIndexApiProvider) => {
  let personsApi

  beforeAll(() => {
    personsApi = require('../../../../app/api/ddi-index-api/persons')
  })

  test('GET /persons with firstName and lastName', async () => {
    await ddiIndexApiProvider.addInteraction(getPersonsFirstNameLastNameInteraction)

    const response = await personsApi.getPersons(mandatoryGetPersonsQueryParams, user)
    expect(response.length < 100).toBe(true)
  })

  test('POST /cdo with optional data including country', async () => {
    await ddiIndexApiProvider.addInteraction(getPersonsFirstNameLastNameDOBInteraction)

    const response = await personsApi.getPersons(allGetPersonsQueryParams, user)
    expect(response.length < 100).toBe(true)
  })
}

module.exports = {
  personsTests
}
