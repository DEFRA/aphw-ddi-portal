const ViewModel = require('../../../../../../app/models/cdo/manage/tasks/record-verification-dates')

describe('RecordVerificationDates Model', () => {
  test('should handle backnav', () => {
    const backNav = { backLink: '/some-non-root-url' }
    const data = { indexNumber: 'ED12345', task: { completed: false }, verificationOptions: {} }
    const res = new ViewModel(data, backNav)
    expect(res.model.backLink).toBe('/some-non-root-url')
  })

  test('should handle root/missing backnav', () => {
    const backNav = { backLink: '/' }
    const data = { indexNumber: 'ED12345', task: { completed: false }, verificationOptions: {} }
    const res = new ViewModel(data, backNav)
    expect(res.model.backLink).toBe('/cdo/manage/cdo/ED12345')
  })

  test('should handle errors', () => {
    const backNav = { backLink: '/' }
    const data = {
      indexNumber: 'ED400144',
      tasks: {
        applicationPackSent: {
          key: 'applicationPackSent',
          available: true,
          completed: true,
          readonly: true,
          timestamp: '2024-11-28T00:00:00.000Z'
        },
        insuranceDetailsRecorded: {
          key: 'insuranceDetailsRecorded',
          available: true,
          completed: true,
          readonly: false,
          timestamp: '2024-11-28T00:00:00.000Z'
        },
        microchipNumberRecorded: {
          key: 'microchipNumberRecorded',
          available: true,
          completed: true,
          readonly: false,
          timestamp: '2024-11-28T00:00:00.000Z'
        },
        applicationFeePaid: {
          key: 'applicationFeePaid',
          available: true,
          completed: true,
          readonly: false,
          timestamp: '2024-11-28T00:00:00.000Z'
        },
        form2Sent: {
          key: 'form2Sent',
          available: true,
          completed: true,
          readonly: true,
          timestamp: '2024-11-28T00:00:00.000Z'
        },
        verificationDateRecorded: {
          key: 'verificationDateRecorded',
          available: true,
          completed: true,
          readonly: false,
          timestamp: '2024-11-28T00:00:00.000Z'
        },
        certificateIssued: {
          key: 'certificateIssued',
          available: true,
          completed: false,
          readonly: false
        }
      },
      verificationOptions: {
        dogDeclaredUnfit: true,
        neuteringBypassedUnder16: true,
        allowDogDeclaredUnfit: true,
        allowNeuteringBypass: true,
        showNeuteringBypass: true
      },
      applicationPackSent: '2024-11-28T00:00:00.000Z',
      insuranceCompany: 'Allianz',
      insuranceRenewal: '2026-01-01T00:00:00.000Z',
      microchipNumber: '123456789012355',
      applicationFeePaid: '2024-01-01T00:00:00.000Z',
      form2Sent: '2024-11-28T00:00:00.000Z',
      microchipVerification: { year: '2023', month: '1', day: '1' },
      task: {
        key: 'verificationDateRecorded',
        available: true,
        completed: true,
        readonly: false,
        timestamp: '2024-11-28T00:00:00.000Z'
      },
      'microchipVerification-day': '1',
      'microchipVerification-month': '1',
      'microchipVerification-year': '2023',
      dogNotFitForMicrochip: '',
      'neuteringConfirmation-day': '1',
      'neuteringConfirmation-month': '1',
      'neuteringConfirmation-year': '2023',
      dogNotNeutered: '',
      taskName: 'record-verification-dates',
      neuteringConfirmation: { year: '2023', month: '1', day: '1' }
    }

    const errors = {
      details: [
        {
          message: 'Enter the date the dog’s microchip number was verified, or select ‘Dog declared unfit for microchipping by vet’',
          path: ['microchipVerification'],
          type: 'custom',
          context: {
            path: ['microchipVerification', ['day', 'month', 'year']],
            label: 'microchipVerification',
            value: { year: '2023', month: '1', day: '1' },
            key: 'microchipVerification'
          }
        }, {
          message: 'Enter the date the dog’s neutering was verified, or select ‘Dog aged under 16 months and not neutered’',
          path: ['neuteringConfirmation'],
          type: 'custom',
          context: {
            path: ['neuteringConfirmation', ['day', 'month', 'year']],
            label: 'neuteringConfirmation',
            value: { year: '2023', month: '1', day: '1' },
            key: 'neuteringConfirmation'
          }
        }]
    }

    const res = new ViewModel(data, backNav, errors)
    expect(res.model.microchipGroupClass).toBe('govuk-form-group--error')
    expect(res.model.neuteringGroupClass).toBe('govuk-form-group--error')
  })
})
