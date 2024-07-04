jest.mock('../../../../../../../app/api/ddi-index-api/cdo')
const { getCdoTaskDetails } = require('../../../../../../../app/api/ddi-index-api/cdo')

jest.mock('../../../../../../../app/api/ddi-index-api/insurance')
const { getCompanies } = require('../../../../../../../app/api/ddi-index-api/insurance')

const { createModel, getValidation, getTaskData, getTaskDetails, getTaskDetailsByKey } = require('../../../../../../../app/routes/cdo/manage/tasks/generic-task-helper')

describe('Generic Task Helper test', () => {
  describe('CreateModel', () => {
    test('handles invalid task name', () => {
      expect(() => createModel('invalid')).toThrow('Invalid task invalid when getting model')
    })

    test('includes task name and backNav in resulting model', () => {
      const data = {
        indexNumber: 'ED12345',
        task: {
          completed: false
        }
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
      const payload = { taskName: 'record-insurance-details', insuranceCompany: 'Company 1', 'insuranceRenewal-day': '01', 'insuranceRenewal-month': '01', 'insuranceRenewal-year': '2099' }
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
      const payload = { taskName: 'record-verification-dates', 'microchipVerification-day': '01', 'microchipVerification-month': '05', 'microchipVerification-year': '2024', 'neuteringConfirmation-day': '01', 'neuteringConfirmation-month': '05', 'neuteringConfirmation-year': '2024' }
      expect(() => getValidation(payload)).not.toThrow()
      const res = getValidation(payload)
      expect(res.taskName).toBe('record-verification-dates')
    })
  })

  describe('getTaskDetails', () => {
    test('throws error if invalid task', () => {
      expect(() => getTaskDetails('invalid')).toThrow('Invalid task invalid when getting details')
    })
  })

  describe('getTaskDetailsByKey', () => {
    test('throws error if invalid task', () => {
      expect(() => getTaskDetailsByKey('invalid')).toThrow('Invalid task invalid when getting details')
    })
  })

  describe('getTaskData', () => {
    test('adds indexNumber', async () => {
      getCdoTaskDetails.mockResolvedValue({
        tasks: {
          applicationPackSent: {
            key: 'applicationPackSent',
            available: true,
            completed: true,
            readonly: true,
            timestamp: '2024-06-27T00:00:00.000Z'
          }
        }
      })
      getCompanies.mockResolvedValue([{ company: 'Company 1' }])
      const res = await getTaskData('ED123', 'send-application-pack')
      expect(res.indexNumber).toBe('ED123')
      expect(res.task).toEqual({
        key: 'applicationPackSent',
        available: true,
        completed: true,
        readonly: true,
        timestamp: '2024-06-27T00:00:00.000Z'
      })
      expect(res.companies).toBe(undefined)
    })

    test('adds companies if record-insurance-details', async () => {
      getCdoTaskDetails.mockResolvedValue({
        tasks: {
          insuranceDetailsRecorded: {
            key: 'insuranceDetailsRecorded',
            available: true,
            completed: true,
            readonly: false,
            timestamp: '2024-06-27T00:00:00.000Z'
          }
        }
      })
      getCompanies.mockResolvedValue([{ company: 'Company 1' }])
      const res = await getTaskData('ED123', 'record-insurance-details')
      expect(res.indexNumber).toBe('ED123')
      expect(res.task).toEqual({
        key: 'insuranceDetailsRecorded',
        available: true,
        completed: true,
        readonly: false,
        timestamp: '2024-06-27T00:00:00.000Z'
      })
      expect(res.companies).toEqual([{ company: 'Company 1' }])
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })
})
