const { deleteDog } = require('../../interactions/api/dogs')
const { userWithDisplayname } = require('../../../mocks/auth')

const dogsTests = (ddiIndexApiProvider) => {
  let dogsApi

  beforeAll(() => {
    dogsApi = require('../../../../app/api/ddi-index-api/dog')
  })

  test('DELETE /dog with ', async () => {
    await ddiIndexApiProvider.addInteraction(deleteDog)

    await dogsApi.deleteDog('ED300000', userWithDisplayname)
  })
}

module.exports = {
  dogsTests
}
