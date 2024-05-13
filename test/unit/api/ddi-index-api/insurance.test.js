const { user } = require('../../../mocks/auth')
const { ApiConflictError } = require('../../../../app/errors/api-conflict-error')

describe('DDI API insuranceCompanys', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { post, callDelete } = require('../../../../app/api/ddi-index-api/base')

  const { addInsuranceCompany, removeInsuranceCompany } = require('../../../../app/api/ddi-index-api/insurance')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('addInsuranceCompany', () => {
    test('should create a new insurance company', async () => {
      const name = 'Mario World Pet Insurance'
      const expectedInsuranceCompany = {
        id: 29,
        name
      }
      post.mockResolvedValue(expectedInsuranceCompany)

      /**
       * @type {InsuranceCompanyRequest}
       */
      const insuranceCompany = { name }
      const createdInsuranceCompany = await addInsuranceCompany(insuranceCompany, user)
      expect(createdInsuranceCompany).toEqual(expectedInsuranceCompany)
      expect(post).toHaveBeenCalledWith('insurance/companies', insuranceCompany, user)
    })

    test('should throw an ApiConflictError given there is a duplicate', async () => {
      post.mockRejectedValue({
        isBoom: true,
        output: {
          statusCode: 409,
          payload: {
            statusCode: 409,
            error: 'Conflict',
            message: 'Response Error: 409 Conflict'
          },
          headers: {}
        }
      })

      await expect(addInsuranceCompany({ name: 'Mario World Pet Insurance' }, user)).rejects.toThrow(new ApiConflictError({ message: 'This insurance company is already in the Index' }))
    })

    test('should throw a normal error given there is an error code other than 409', async () => {
      post.mockRejectedValue(new Error('server error'))

      await expect(addInsuranceCompany({ name: 'Mario World Pet Insurance' }, user)).rejects.toThrow(new Error('server error'))
    })
  })

  describe('removeInsuranceCompany', () => {
    test('should create a new insuranceCompany', async () => {
      const insuranceCompanyId = 29

      callDelete.mockResolvedValue()

      await removeInsuranceCompany(insuranceCompanyId, user)

      expect(callDelete).toHaveBeenCalledWith('insurance/companies/29', user)
    })
  })
})
