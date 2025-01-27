jest.mock('../../../../../../../app/api/ddi-index-api/cdo')
const { getCdoTaskDetails } = require('../../../../../../../app/api/ddi-index-api/cdo')

jest.mock('../../../../../../../app/api/ddi-index-api/insurance')
const { getCompanies } = require('../../../../../../../app/api/ddi-index-api/insurance')

jest.mock('../../../../../../../app/session/cdo/manage')
const { getVerificationPayload } = require('../../../../../../../app/session/cdo/manage')

const { createModel, getValidation, getTaskData, getTaskDetails, getTaskDetailsByKey, verificationData } = require('../../../../../../../app/routes/cdo/manage/tasks/generic-task-helper')
const { buildTaskListFromComplete, buildTaskListTasks } = require('../../../../../../mocks/cdo/manage/tasks/builder')

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

      const res = createModel('process-application-pack', data, backNav)

      expect(res.model.taskName).toBe('process-application-pack')
      expect(res.model.backLink).toBe('/back')
      expect(res.model.srcHashParam).toBe('?src=abc123')
    })

    test('passes errors', () => {
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
      const errors = { details: [{ path: ['taskDone'], message: 'Confirm if you have sent the Form 2 before continuing.' }] }

      const res = createModel('send-form2', data, backNav, errors)

      expect(res.model.taskName).toBe('send-form2')
      expect(res.model.errors.length).not.toBe(0)
      expect(res.model.errors[0].text).toBe('Confirm if you have sent the Form 2 before continuing.')
    })
  })

  describe('GetValidation', () => {
    test('handles invalid task name', () => {
      expect(() => getValidation({ taskName: 'invalid' })).toThrow('Invalid task invalid when getting validation')
    })

    test('should get correct validation for task 1 (Send application pack)', () => {
      const payload = { taskName: 'send-application-pack', contact: 'email', email: 'garrymcfadyen@hotmail.com' }
      expect(() => getValidation(payload)).not.toThrow()
      const res = getValidation(payload)
      expect(res.taskName).toBe('send-application-pack')
    })

    test('should get correct validation for task 2 (Record insurance details)', () => {
      const payload = { taskName: 'record-insurance-details', insuranceCompany: 'Company 1', 'insuranceRenewal-day': '01', 'insuranceRenewal-month': '01', 'insuranceRenewal-year': '2099' }
      expect(() => getValidation(payload)).not.toThrow()
      const res = getValidation(payload)
      expect(res.taskName).toBe('record-insurance-details')
    })

    test('should get correct validation for task 3 (Record microchip number)', () => {
      const payload = { taskName: 'record-microchip-number', microchipNumber: '123451234512345' }
      expect(() => getValidation(payload)).not.toThrow()
      const res = getValidation(payload)
      expect(res.taskName).toBe('record-microchip-number')
    })

    test('should get correct validation for task 4 (Record application fee payment)', () => {
      const payload = { taskName: 'record-application-fee-payment', 'applicationFeePaid-day': '01', 'applicationFeePaid-month': '05', 'applicationFeePaid-year': '2024' }
      expect(() => getValidation(payload)).not.toThrow()
      const res = getValidation(payload)
      expect(res.taskName).toBe('record-application-fee-payment')
    })

    test('should get correct validation for task 5 (Request Form 2)', () => {
      const payload = { taskName: 'send-form2', taskDone: 'Y' }
      expect(() => getValidation(payload)).not.toThrow()
      const res = getValidation(payload)
      expect(res.taskName).toBe('send-form2')
    })

    describe('verification dates', () => {
      test('should get correct validation for task 6 (Verification Dates)', () => {
        const payload = { taskName: 'record-verification-dates', 'microchipVerification-day': '01', 'microchipVerification-month': '05', 'microchipVerification-year': '2024', 'neuteringConfirmation-day': '01', 'neuteringConfirmation-month': '05', 'neuteringConfirmation-year': '2024' }
        expect(() => getValidation(payload)).not.toThrow()
        const res = getValidation(payload)
        expect(res.taskName).toBe('record-verification-dates')
      })

      test('should get correct validation for Verification Dates with optional fields', () => {
        const payload = {
          'microchipVerification-day': '',
          'microchipVerification-month': '',
          'microchipVerification-year': '',
          dogNotFitForMicrochip: '',
          'neuteringConfirmation-day': '',
          'neuteringConfirmation-month': '',
          'neuteringConfirmation-year': '',
          dogNotNeutered: '',
          taskName: 'record-verification-dates',
          microchipVerification: { year: '', month: '', day: '' },
          neuteringConfirmation: { year: '', month: '', day: '' }
        }

        expect(() => getValidation(payload)).not.toThrow()
        const res = getValidation(payload)
        expect(res.taskName).toBe('record-verification-dates')
      })

      test('should fail if dogNotNeutered & neuteringConfirmation set', () => {
        const payload = {
          'microchipVerification-day': '',
          'microchipVerification-month': '',
          'microchipVerification-year': '',
          dogNotFitForMicrochip: '',
          'neuteringConfirmation-day': '01',
          'neuteringConfirmation-month': '05',
          'neuteringConfirmation-year': '2024',
          dogNotNeutered: '',
          taskName: 'record-verification-dates',
          microchipVerification: { year: '', month: '', day: '' },
          neuteringConfirmation: { year: '', month: '', day: '' }
        }

        expect(() => getValidation(payload)).toThrow()
      })

      test('should fail if invalid neuteringConfirmation on ', () => {
        const payload = {
          'microchipVerification-day': '10',
          'microchipVerification-month': '10',
          'microchipVerification-year': '2025',
          dogNotFitForMicrochip: '',
          'neuteringConfirmation-day': '41',
          'neuteringConfirmation-month': '05',
          'neuteringConfirmation-year': '2025',
          dogNotNeutered: false,
          taskName: 'record-microchip-deadline',
          microchipVerification: { year: '', month: '', day: '' },
          neuteringConfirmation: { year: '', month: '', day: '' }
        }

        expect(() => getValidation(payload)).toThrow()
      })
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
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromComplete({
        tasks: buildTaskListTasks({
          applicationPackSent: {
            key: 'applicationPackSent',
            available: true,
            completed: true,
            readonly: true,
            timestamp: '2024-06-27T00:00:00.000Z'
          }
        })
      }))
      getCompanies.mockResolvedValue([{ company: 'Company 1' }])
      const res = await getTaskData('ED123', 'send-application-pack', {}, {})
      expect(res.indexNumber).toBe('ED123')
      expect(res.task).toEqual({
        key: 'applicationPackSent',
        available: true,
        completed: true,
        readonly: true,
        timestamp: '2024-06-27T00:00:00.000Z'
      })
      expect(res.companies).toBeUndefined()
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
      const res = await getTaskData('ED123', 'record-insurance-details', {}, {})
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

    test('should set dogDeclaredUnfit and neuteringBypassedUnder16 from api', async () => {
      const verificationOptions = {
        dogDeclaredUnfit: true,
        allowNeuteringBypass: true,
        neuteringBypassedUnder16: true,
        showNeuteringBypass: true,
        allowDogDeclaredUnfit: true
      }
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromComplete({
        verificationOptions
      }))
      const res = await getTaskData('ED123', 'record-verification-dates', {}, {})

      expect(res.verificationOptions).toEqual(verificationOptions)
    })

    test('should set dogDeclaredUnfit and neuteringBypassedUnder16 from payload', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromComplete({
        verificationOptions: {
          dogDeclaredUnfit: true,
          allowNeuteringBypass: true,
          neuteringBypassedUnder16: true,
          showNeuteringBypass: true,
          allowDogDeclaredUnfit: true
        }
      }))
      const res = await getTaskData('ED123', 'record-verification-dates', {}, {}, { test: true })

      expect(res.verificationOptions).toEqual({
        dogDeclaredUnfit: false,
        neuteringBypassedUnder16: false,
        allowNeuteringBypass: true,
        showNeuteringBypass: true,
        allowDogDeclaredUnfit: true
      })
    })

    test('should set dogDeclaredUnfit and neuteringBypassedUnder16 from payload even if session exists', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromComplete({
        verificationOptions: {
          dogDeclaredUnfit: true,
          allowNeuteringBypass: true,
          neuteringBypassedUnder16: true,
          showNeuteringBypass: true,
          allowDogDeclaredUnfit: true
        }
      }))
      getVerificationPayload.mockReturnValue({
        neuteringConfirmation: { year: '', month: '', day: '' },
        microchipVerification: { year: '', month: '', day: '' },
        dogNotFitForMicrochip: true,
        dogNotNeutered: true
      })
      const res = await getTaskData('ED123', 'record-verification-dates', {}, {}, { test: true })

      expect(res.verificationOptions).toEqual({
        dogDeclaredUnfit: false,
        neuteringBypassedUnder16: false,
        allowNeuteringBypass: true,
        showNeuteringBypass: true,
        allowDogDeclaredUnfit: true
      })
    })

    test('should set dogDeclaredUnfit and neuteringBypassedUnder16 from session if no payload exists', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromComplete({
        verificationOptions: {
          dogDeclaredUnfit: false,
          neuteringBypassedUnder16: false,
          allowNeuteringBypass: true,
          showNeuteringBypass: true,
          allowDogDeclaredUnfit: true
        }
      }))
      getVerificationPayload.mockReturnValue({
        neuteringConfirmation: { year: '', month: '', day: '' },
        microchipVerification: { year: '', month: '', day: '' },
        dogNotFitForMicrochip: true,
        dogNotNeutered: true
      })
      const res = await getTaskData('ED123', 'record-verification-dates', {}, {})

      expect(res.verificationOptions).toEqual({
        dogDeclaredUnfit: true,
        neuteringBypassedUnder16: true,
        allowNeuteringBypass: true,
        showNeuteringBypass: true,
        allowDogDeclaredUnfit: true
      })
    })
  })

  describe('verificationData', () => {
    test('should use defaults if missing', () => {
      getVerificationPayload.mockReturnValue({
        dogNotFitForMicrochip: undefined,
        dogNotNeutered: undefined,
        neuteringConfirmation: new Date('2024-11-12')
      })

      const data = verificationData({
        verificationOptions: {
          dogNotFitForMicrochip: false,
          dogNotNeutered: false
        }
      }, {}, {
        neuteringConfirmation: new Date('2024-11-12')
      })

      expect(data).toEqual({
        neuteringConfirmation: new Date('2024-11-12T00:00:00.000Z'),
        'neuteringConfirmation-day': undefined,
        'neuteringConfirmation-month': undefined,
        'neuteringConfirmation-year': undefined,
        verificationOptions: {
          dogDeclaredUnfit: false,
          dogNotFitForMicrochip: false,
          dogNotNeutered: false,
          neuteringBypassedUnder16: false
        }
      })
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })
})
