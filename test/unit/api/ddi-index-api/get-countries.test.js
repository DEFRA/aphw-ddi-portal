jest.mock('../../../../app/api/ddi-index-api/base')
const { get } = require('../../../../app/api/ddi-index-api/base')

const { getCountries } = require('../../../../app/api/ddi-index-api/countries')

describe('DDI API counties', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns a list of counties', async () => {
    get.mockResolvedValue({
      countries: [
        'England',
        'Scotland',
        'Wales'
      ]
    })

    const countries = await getCountries()
    expect(countries).toBeInstanceOf(Array)
    expect(countries).toHaveLength(3)
    expect(countries).toEqual(['England', 'Scotland', 'Wales'])
  })
})
