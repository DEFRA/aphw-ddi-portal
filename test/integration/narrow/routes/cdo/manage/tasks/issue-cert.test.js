const Joi = require('joi')
const { ApiErrorFailure } = require('../../../../../../../app/errors/api-error-failure')

describe('Issue Cert test', () => {
  jest.mock('../../../../../../../app/api/ddi-index-api/cdo')
  const { saveCdoTaskDetails } = require('../../../../../../../app/api/ddi-index-api/cdo')

  const { issueCertTask } = require('../../../../../../../app/routes/cdo/manage/tasks/issue-cert')

  describe('issueCertTask', () => {
    test('saves CDO task details without error', async () => {
      saveCdoTaskDetails.mockResolvedValue()

      const res = await issueCertTask('ED123', {})

      expect(res).toBe(null)
    })

    test('returns error if ApiErrorFailure', async () => {
      saveCdoTaskDetails.mockImplementation(() => { throw new ApiErrorFailure('Test error', { payload: { message: 'Test error' } }) })

      const res = await issueCertTask('ED123', {})

      expect(res).toEqual(new Joi.ValidationError('Test error', [{ message: 'Test error', path: ['generalError'], type: 'custom' }]))
    })

    test('throws if non-ApiErrorFailure error', async () => {
      saveCdoTaskDetails.mockImplementation(() => { throw new Error('Test error2') })

      await expect(issueCertTask('ED123', {})).rejects.toThrow('Test error2')
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })
})
