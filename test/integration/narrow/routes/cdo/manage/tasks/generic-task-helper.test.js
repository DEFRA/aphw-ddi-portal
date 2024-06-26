jest.mock('../../../../../../../app/api/ddi-index-api/cdo')
const { getCdoTaskDetails } = require('../../../../../../../app/api/ddi-index-api/cdo')

jest.mock('../../../../../../../app/api/ddi-index-api/insurance')
const { getCompanies } = require('../../../../../../../app/api/ddi-index-api/insurance')

const { createModel, getValidation, getTaskData, getTaskPayloadData } = require('../../../../../../../app/routes/cdo/manage/tasks/generic-task-helper')

describe('Generic Task Helper test', () => {
  describe('CreateModel', () => {
    test('handles invalid task name', () => {
      expect(() => createModel('invalid')).toThrow('Invalid task invalid when getting model')
    })

    test('includes task name and backNav in resulting model', () => {
      const data = {
        indexNumber: 'ED12345'
      }
      const backNav = {
        backLink: '/back',
        srcHashParam: '?src=abc123'
      }

      const res = createModel('send-application-pack', data, backNav)

      expect(res.model.taskName).toBe('send-application-pack')
      expect(res.model.backLink).toBe('/back')
      expect(res.model.srcHashParam).toBe('?src=abc123')
    })

    test('passes errors', () => {
      const data = {
        indexNumber: 'ED12345'
      }
      const backNav = {
        backLink: '/back',
        srcHashParam: '?src=abc123'
      }
      const errors = { details: [{ path: ['taskDone'], message: 'Selection is required' }] }

      const res = createModel('send-form2', data, backNav, errors)

      expect(res.model.taskName).toBe('send-form2')
      expect(res.model.errors.length).not.toBe(0)
      expect(res.model.errors[0].text).toBe('Selection is required')
    })
  })

  describe('GetValidation', () => {
    test('handles invalid task name', () => {
      expect(() => getValidation({ taskName: 'invalid' })).toThrow('Invalid task invalid when getting validation')
    })

    test('should get correct validation for task 1', () => {
      const payload = { taskName: 'send-application-pack', taskDone: 'Y' }
      expect(() => getValidation(payload)).not.toThrow()
      const res = getValidation(payload)
      expect(res.taskName).toBe('send-application-pack')
    })

    test('should get correct validation for task 2', () => {
      const payload = { taskName: 'record-insurance-details' }
      expect(() => getValidation(payload)).not.toThrow()
      const res = getValidation(payload)
      expect(res.taskName).toBe('record-insurance-details')
    })

    test('should get correct validation for task 3', () => {
      const payload = { taskName: 'record-microchip-number', microchipNumber: '123451234512345' }
      expect(() => getValidation(payload)).not.toThrow()
      const res = getValidation(payload)
      expect(res.taskName).toBe('record-microchip-number')
    })

    test('should get correct validation for task 4', () => {
      const payload = { taskName: 'record-application-fee-payment', 'applicationFeePaid-day': '01', 'applicationFeePaid-month': '05', 'applicationFeePaid-year': '2024' }
      expect(() => getValidation(payload)).not.toThrow()
      const res = getValidation(payload)
      expect(res.taskName).toBe('record-application-fee-payment')
    })

    test('should get correct validation for task 5', () => {
      const payload = { taskName: 'send-form2', taskDone: 'Y' }
      expect(() => getValidation(payload)).not.toThrow()
      const res = getValidation(payload)
      expect(res.taskName).toBe('send-form2')
    })

    test('should get correct validation for task 6', () => {
      const payload = { taskName: 'record-verification-dates' }
      expect(() => getValidation(payload)).not.toThrow()
      const res = getValidation(payload)
      expect(res.taskName).toBe('record-verification-dates')
    })
  })

  describe('getTaskData', () => {
    test('adds indexNumber', async () => {
      getCdoTaskDetails.mockResolvedValue({ task: { info: '12345' } })
      getCompanies.mockResolvedValue([{ company: 'Company 1' }])
      const res = await getTaskData('ED123', 'send-application-pack')
      expect(res.indexNumber).toBe('ED123')
      expect(res.task).toEqual({ info: '12345' })
      expect(res.companies).toBe(undefined)
    })

    test('adds companies if record-insurance-details', async () => {
      getCdoTaskDetails.mockResolvedValue({ task: { info: '67890' } })
      getCompanies.mockResolvedValue([{ company: 'Company 1' }])
      const res = await getTaskData('ED123', 'record-insurance-details')
      expect(res.indexNumber).toBe('ED123')
      expect(res.task).toEqual({ info: '67890' })
      expect(res.companies).toEqual([{ company: 'Company 1' }])
    })
  })

  describe('getTaskPayloadData', () => {
    test('adds indexNumber', async () => {
      const payload = { task: { info: '12345' } }
      getCompanies.mockResolvedValue([{ company: 'Company 1' }])
      const res = await getTaskPayloadData('ED123', 'send-application-pack', payload)
      expect(res.indexNumber).toBe('ED123')
      expect(res.task).toEqual({ info: '12345' })
      expect(res.companies).toBe(undefined)
    })

    test('adds companies if record-insurance-details', async () => {
      const payload = { task: { info: '67890' } }
      getCompanies.mockResolvedValue([{ company: 'Company 1' }])
      const res = await getTaskPayloadData('ED123', 'record-insurance-details', payload)
      expect(res.indexNumber).toBe('ED123')
      expect(res.task).toEqual({ info: '67890' })
      expect(res.companies).toEqual([{ company: 'Company 1' }])
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })
})
