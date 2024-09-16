const { user } = require('../../../mocks/auth')

describe('DDI API documenation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get } = require('../../../../app/api/ddi-index-api/base')
  const { getDocumentation } = require('../../../../app/api/ddi-index-api/documentation')

  test('returns swagger documentation', async () => {
    get.mockResolvedValue({
      info: 'API Documentation'
    })

    const documentation = await getDocumentation(user)
    expect(documentation).toEqual({
      info: 'API Documentation'
    })
  })
})
