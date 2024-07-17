jest.mock('../../../../app/api/ddi-index-api/base')
const { get } = require('../../../../app/api/ddi-index-api/base')

const { getBreachCategories } = require('../../../../app/api/ddi-index-api/dog-breaches')

describe('DDI API Dog Breeches', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns a list of counties', async () => {
    const mockBreachCategories = [
      {
        id: 1,
        label: 'dog not covered by third party insurance',
        short_name: 'NOT_COVERED_BY_INSURANCE'
      },
      {
        id: 2,
        label: 'dog not kept on lead or muzzled',
        short_name: 'NOT_ON_LEAD_OR_MUZZLED'
      },
      {
        id: 3,
        label: 'dog kept in insecure place',
        short_name: 'INSECURE_PLACE'
      }
    ]

    const expectdBreachCategories = [
      {
        id: 1,
        label: 'Dog not covered by third party insurance',
        short_name: 'NOT_COVERED_BY_INSURANCE'
      },
      {
        id: 2,
        label: 'Dog not kept on lead or muzzled',
        short_name: 'NOT_ON_LEAD_OR_MUZZLED'
      },
      {
        id: 3,
        label: 'Dog kept in insecure place',
        short_name: 'INSECURE_PLACE'
      }
    ]
    get.mockResolvedValue({
      breachCategories: mockBreachCategories
    })

    const breachCategories = await getBreachCategories()
    expect(breachCategories).toBeInstanceOf(Array)
    expect(breachCategories).toHaveLength(3)
    expect(breachCategories).toEqual(expectdBreachCategories)
  })
})
