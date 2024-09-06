jest.mock('../../../../app/api/ddi-index-api/base')
const { get, post } = require('../../../../app/api/ddi-index-api/base')
const { user } = require('../../../mocks/auth')

const { getBreachCategories, setDogBreaches } = require('../../../../app/api/ddi-index-api/dog-breaches')

describe('DDI API Dog Breeches', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getBreachCategories', () => {
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

      const breachCategories = await getBreachCategories(user)
      expect(breachCategories).toBeInstanceOf(Array)
      expect(breachCategories).toHaveLength(3)
      expect(breachCategories).toEqual(expectdBreachCategories)
    })
  })

  describe('setInBreach', () => {
    test('should set a Dog to status In Breach and return the Dog Dto', async () => {
      const validDog = {
        dog: {
          id: 123,
          status: {
            id: 8,
            status: 'In breach',
            status_type: 'STANDARD'
          }
        },
        dogBreaches: [
          {
            id: 1,
            label: 'dog not covered by third party insurance',
            short_name: 'NOT_COVERED_BY_INSURANCE'
          },
          {
            id: 2,
            label: 'dog not kept on lead or muzzled',
            short_name: 'NOT_ON_LEAD_OR_MUZZLED'
          }
        ]
      }
      post.mockResolvedValue(validDog)
      const requestPayload = {
        indexNumber: 'ED123',
        dogBreaches: [
          'NOT_COVERED_BY_INSURANCE',
          'NOT_ON_LEAD_OR_MUZZLED'
        ]
      }
      const res = await setDogBreaches(requestPayload, user)
      expect(res).toEqual(validDog)
      expect(post).toHaveBeenCalledWith('breaches/dog:setBreaches', requestPayload, user)
    })
  })
})
