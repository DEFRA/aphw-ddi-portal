jest.mock('../../../../app/api/ddi-index-api/base')
const { get } = require('../../../../app/api/ddi-index-api/base')

const { getCounties } = require('../../../../app/api/ddi-index-api/counties')

describe('DDI API counties', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns a list of counties', async () => {
    get.mockResolvedValue({
      counties: [
        'County 1',
        'County 2'
      ]
    })

    const counties = await getCounties()
    expect(counties).toBeInstanceOf(Array)
    expect(counties).toHaveLength(2)
    expect(counties).toEqual(['County 1', 'County 2'])
  })
})
