const {
  postCdoWithoutCountryInteraction,
  postCdoWithCountryInteraction,
  postCdoWithOwnerLookupInteraction
} = require('../../interactions/api/cdo')
const {
  validCdoRequest,
  validCdoRequestWithCountry,
  validCdoRequestWithPersonReference
} = require('../../matchers/cdo')
const { userWithDisplayname } = require('../../../mocks/auth')
const CdoCreatedViewModel = require('../../../../app/models/cdo/create/record-created')

const cdoTests = (ddiIndexApiProvider) => {
  let cdoApi

  beforeAll(() => {
    cdoApi = require('../../../../app/api/ddi-index-api/cdo')
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
}

module.exports = {
  cdoTests
}
