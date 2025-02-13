const FormData = require('form-data')
const { auth, user, userWithDisplayname } = require('../../../../../../mocks/auth')
jest.mock('../../../../../../../app/session/session-wrapper')
const { setInSession } = require('../../../../../../../app/session/session-wrapper')
const { JSDOM } = require('jsdom')
jest.mock('../../../../../../../app/api/ddi-index-api/search')
const { notYetStartedTaskList } = require('../../../../../../mocks/cdo/manage/tasks/not-yet-started')
const { ApiErrorFailure } = require('../../../../../../../app/errors/api-error-failure')
const {
  buildTaskListFromComplete, buildTaskListTasksFromComplete, buildTask, buildVerificationOptions,
  buildTaskListFromInitial, buildVerificationPayload
} = require('../../../../../../mocks/cdo/manage/tasks/builder')

describe('Generic Task test', () => {
  jest.mock('../../../../../../../app/auth')
  const mockAuth = require('../../../../../../../app/auth')

  jest.mock('../../../../../../../app/api/ddi-index-api/cdo')
  const { getCdoTaskDetails, saveCdoTaskDetails, getCdo } = require('../../../../../../../app/api/ddi-index-api/cdo')

  jest.mock('../../../../../../../app/api/ddi-index-api/insurance')
  const { getCompanies } = require('../../../../../../../app/api/ddi-index-api/insurance')

  jest.mock('../../../../../../../app/session/cdo/manage')
  const { getVerificationPayload, setVerificationPayload, clearVerificationPayload } = require('../../../../../../../app/session/cdo/manage')

  const createServer = require('../../../../../../../app/server')
  let server

  setInSession.mockReturnValue()

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/manage/task/send-application-pack/:index-number', () => {
    test('should return a 200 if Pre-exempt and email exists', async () => {
      getCdoTaskDetails.mockResolvedValue({
        ...notYetStartedTaskList,
        cdoSummary: {
          person: {
            firstName: 'Garry',
            lastName: 'McFadyen',
            email: 'garrymcfadyen@hotmail.com',
            addressLine1: '221b, Baker Street',
            addressLine2: '',
            town: 'London',
            postcode: 'NW1 6XE'
          }
        }
      })
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/send-application-pack/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelector('form span').textContent.trim()).toBe('Dog ED20001')
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('How do you want to send the application pack?')
      expect(document.querySelector('div#contact-hint').textContent.trim()).toBe('Select one option.')
      expect(document.querySelectorAll('.govuk-radios__item label')[0].textContent.trim()).toBe('Email it to:garrymcfadyen@hotmail.com')
      expect(document.querySelectorAll('.govuk-radios__item label')[1].textContent.trim()).toBe('Post it to:Garry McFadyen221b, Baker StreetLondonNW1 6XE')
      expect(document.querySelectorAll('button')[4].textContent.trim()).toBe('Send application')
      expect(document.querySelector('#email').value).toBe('garrymcfadyen@hotmail.com')
    })

    test('should return 200 if Dog is failed and email does not exist', async () => {
      getCdoTaskDetails.mockResolvedValue({
        ...notYetStartedTaskList,
        cdoSummary: {
          person: {
            firstName: 'Garry',
            lastName: 'McFadyen',
            email: null,
            addressLine1: '221b, Baker Street',
            addressLine2: '',
            town: 'London',
            postcode: 'NW1 6XE'
          }
        }
      })
      getCdo.mockResolvedValue({ dog: { status: 'Failed' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/send-application-pack/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('.govuk-radios__item label')[0].textContent.trim()).toBe('Email')
      expect(document.querySelector('.govuk-radios__conditional').textContent.trim()).toBe('Email address              Enter the dog owner’s email address.')
      expect(document.querySelector('#email')).toBeNull()
    })

    test('should return 500 if invalid dog index', async () => {
      getCdoTaskDetails.mockResolvedValue({
        ...notYetStartedTaskList,
        cdoSummary: {
          person: {
            firstName: 'Garry',
            lastName: 'McFadyen',
            email: 'garrymcfadyen@hotmail.com',
            addressLine1: '221b, Baker Street',
            addressLine2: '',
            town: 'London',
            postcode: 'NW1 6XE'
          }
        }
      })
      getCdo.mockResolvedValue(null)

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/send-application-pack/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(500)
    })

    test('should return 500 if dog at wrong status', async () => {
      getCdoTaskDetails.mockResolvedValue({
        ...notYetStartedTaskList,
        cdoSummary: {
          person: {
            firstName: 'Garry',
            lastName: 'McFadyen',
            email: 'garrymcfadyen@hotmail.com',
            addressLine1: '221b, Baker Street',
            addressLine2: '',
            town: 'London',
            postcode: 'NW1 6XE'
          }
        }
      })
      getCdo.mockResolvedValue({ dog: { status: 'Exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/send-application-pack/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(500)
    })

    test('should return 200 given application back sent', async () => {
      getCdoTaskDetails.mockResolvedValue({
        ...notYetStartedTaskList,
        tasks: {
          ...notYetStartedTaskList.tasks,
          applicationPackSent: {
            available: true,
            completed: true,
            readonly: true
          }
        },
        cdoSummary: {
          person: {
            firstName: 'Garry',
            lastName: 'McFadyen',
            email: 'garrymcfadyen@hotmail.com',
            addressLine1: '221b, Baker Street',
            addressLine2: '',
            town: 'London',
            postcode: 'NW1 6XE'
          }
        }
      })
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/send-application-pack/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
    })
  })

  describe('GET /cdo/manage/task/process-application-pack/:index-number', () => {
    test('should return a 200 if Pre-exempt', async () => {
      getCdoTaskDetails.mockResolvedValue(notYetStartedTaskList)
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/process-application-pack/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelector('form span').textContent.trim()).toBe('Dog ED20001')
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Process application')
      expect(document.querySelector('div#application-pack-hint').textContent.trim()).toBe('Confirm that you have processed the application.')
      expect(document.querySelector('.govuk-checkboxes__item label').textContent.trim()).toBe('I have processed the application')
      expect(document.querySelectorAll('button')[4].textContent.trim()).toBe('Save and continue')
      expect(document.querySelector('#taskDone').getAttribute('checked')).toBeNull()
      expect(document.querySelectorAll('button')[4].getAttribute('disabled')).toBeNull()
    })

    test('should return 200 if Dog is failed', async () => {
      getCdoTaskDetails.mockResolvedValue(notYetStartedTaskList)
      getCdo.mockResolvedValue({ dog: { status: 'Failed' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/process-application-pack/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
    })

    test('should return 500 if invalid dog index', async () => {
      getCdoTaskDetails.mockResolvedValue(notYetStartedTaskList)
      getCdo.mockResolvedValue(null)

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/process-application-pack/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(500)
    })

    test('should return 500 if dog at wrong status', async () => {
      getCdoTaskDetails.mockResolvedValue(notYetStartedTaskList)
      getCdo.mockResolvedValue({ dog: { status: 'Exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/process-application-pack/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(500)
    })

    test('should return 200 given application back sent', async () => {
      getCdoTaskDetails.mockResolvedValue({
        tasks: {
          applicationPackProcessed: {
            available: true,
            completed: true,
            readonly: true
          }
        }
      })
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/process-application-pack/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Process application')
      expect(document.querySelector('#taskDone')).toBeNull()
      expect(document.querySelector('#application-pack-sent').textContent.trim()).toBe('The application has been processed.')
    })
  })

  describe('GET /cdo/manage/task/record-insurance-details/:index-number', () => {
    test('should route return 200', async () => {
      getCdoTaskDetails.mockResolvedValue(notYetStartedTaskList)
      getCompanies.mockResolvedValue([{ company: 'Insurance Company 1' }])
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/record-insurance-details/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelector('form span').textContent.trim()).toBe('Dog ED20001')
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Record insurance details')
      expect(document.querySelectorAll('form div label')[0].textContent.trim()).toBe('What company insures the dog?')
      expect(document.querySelectorAll('form div legend')[0].textContent.trim()).toBe('What is the insurance renewal date?')
      expect(document.querySelectorAll('button')[4].textContent.trim()).toBe('Save and continue')
    })
  })

  describe('GET /cdo/manage/task/record-microchip-number/:index-number', () => {
    test('should return 200', async () => {
      getCdoTaskDetails.mockResolvedValue(notYetStartedTaskList)
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/record-microchip-number/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelector('form span').textContent.trim()).toBe('Dog ED20001')
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('Record microchip number')
      expect(document.querySelectorAll('button')[4].textContent.trim()).toBe('Save and continue')
    })
  })

  describe('GET /cdo/manage/task/record-application-fee-payment/:index-number', () => {
    test('should return 200', async () => {
      getCdoTaskDetails.mockResolvedValue(notYetStartedTaskList)
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/record-application-fee-payment/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelector('form span').textContent.trim()).toBe('Dog ED20001')
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Record application fee payment')
      expect(document.querySelector('div#applicationFeePaid-hint').textContent.trim()).toBe('When was the application fee paid?')
      expect(document.querySelectorAll('button')[4].textContent.trim()).toBe('Save and continue')
    })
  })

  describe('GET /cdo/manage/task/send-form2/:index-number', () => {
    test('should returns 200', async () => {
      getCdoTaskDetails.mockResolvedValue(notYetStartedTaskList)
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/send-form2/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelector('form span').textContent.trim()).toBe('Dog ED20001')
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Request Form 2')
      expect(document.querySelector('div#application-pack-hint').textContent.trim()).toBe('Confirm that you have requested the Form 2 from the police force.')
      expect(document.querySelector('.govuk-checkboxes__item label').textContent.trim()).toBe('I have requested the Form 2')
      expect(document.querySelectorAll('button')[4].textContent.trim()).toBe('Save and continue')
    })
  })

  describe('GET /cdo/manage/task/record-verification-dates/ED20001', () => {
    test('GET /cdo/manage/task/record-verification-dates/ED20001 route returns 200', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromInitial())
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/record-verification-dates/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelector('form span').textContent.trim()).toBe('Dog ED20001')
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Record the verification date for microchip and neutering')
      expect(document.querySelectorAll('.govuk-fieldset__legend--s')[0].textContent.trim()).toBe('When was the dog\'s microchip number verified?')
      expect(document.querySelectorAll('.govuk-fieldset__legend--s')[1].textContent.trim()).toBe('When was the dog\'s neutering verified?')
      expect(document.querySelectorAll('button')[4].textContent.trim()).toBe('Save and continue')
      expect(document.querySelector('.govuk-fieldset').textContent.trim()).not.toContain('Dog aged under 16 months and not neutered')
      expect(document.querySelector('.govuk-fieldset').textContent.trim()).not.toContain('Dog declared unfit for microchipping by vet')
      expect(document.querySelector('.govuk-fieldset').textContent.trim()).not.toContain('Dog not neutered as under 16 months old')
    })

    test('GET /cdo/manage/task/record-verification-dates/ED20001 route shows 6th Si rules if 2015 Dog is under 16 months', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromComplete({
        tasks: buildTaskListTasksFromComplete({
          verificationDateRecorded: buildTask({
            key: 'verificationDateRecorded',
            available: true,
            completed: false,
            readonly: false
          }),
          certificateIssued: buildTask({
            key: 'certificateIssued',
            available: false,
            completed: false,
            readonly: false
          })
        }),
        verificationOptions: buildVerificationOptions({
          allowDogDeclaredUnfit: true,
          allowNeuteringBypass: true,
          showNeuteringBypass: true
        })
      }))
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/record-verification-dates/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      const fieldsetContent = document.querySelector('.govuk-fieldset').textContent.trim()
      expect(fieldsetContent).toContain('Dog aged under 16 months and not neutered')
      expect(fieldsetContent).toContain('Dog declared unfit for microchipping by vet')
      expect(fieldsetContent).not.toContain('Dog not neutered as under 16 months old')
      expect(clearVerificationPayload).not.toHaveBeenCalled()
    })

    test('GET /cdo/manage/task/record-verification-dates/ED20001 with clear should redirect', async () => {
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/record-verification-dates/ED20001?clear=true',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })

    test('GET /cdo/manage/task/record-verification-dates/ED20001 route shows 6th Si rules if no Dog DOB', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromComplete({
        tasks: buildTaskListTasksFromComplete({
          verificationDateRecorded: buildTask({
            key: 'verificationDateRecorded',
            available: true,
            completed: false,
            readonly: false
          }),
          certificateIssued: buildTask({
            key: 'certificateIssued',
            available: false,
            completed: false,
            readonly: false
          })
        }),
        verificationOptions: buildVerificationOptions({
          allowDogDeclaredUnfit: true,
          allowNeuteringBypass: false,
          showNeuteringBypass: true
        })
      }))
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/record-verification-dates/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      const fieldsetContent = document.querySelector('.govuk-fieldset').textContent.trim()
      expect(fieldsetContent).not.toContain('Dog aged under 16 months and not neutered')
      expect(fieldsetContent).toContain('Dog declared unfit for microchipping by vet')
      expect(fieldsetContent).toContain('Dog not neutered as under 16 months old')
    })
  })

  describe('POST /cdo/manage/task/send-application-pack/ED20001', () => {
    test('returns 302 if not auth', async () => {
      const fd = new FormData()

      const options = {
        method: 'POST',
        url: '/cdo/manage/task/send-application-pack/ED20001',
        headers: fd.getHeaders(),
        payload: fd.getBuffer()
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })

    test('fails validation if invalid payload', async () => {
      const options = {
        method: 'POST',
        url: '/cdo/manage/task/send-application-pack/ED20001',
        auth,
        payload: { taskName: 'send-application-pack' }
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(400)
    })

    test('opens next page application pack if called with email', async () => {
      saveCdoTaskDetails.mockResolvedValue({
        email: 'garrymcfadyen@hotmail.com'
      })
      const options = {
        method: 'POST',
        url: '/cdo/manage/task/send-application-pack/ED20001',
        auth,
        payload: { taskName: 'send-application-pack', contact: 'email', email: 'garrymcfadyen@hotmail.com' }
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
      expect(saveCdoTaskDetails).toHaveBeenCalledWith('ED20001', 'emailApplicationPack', {
        ...options.payload,
        updateEmail: false
      }, userWithDisplayname)
    })

    test('opens next page application pack if called with updateEmail', async () => {
      saveCdoTaskDetails.mockResolvedValue({
        email: ''
      })
      const options = {
        method: 'POST',
        url: '/cdo/manage/task/send-application-pack/ED20001',
        auth,
        payload: { taskName: 'send-application-pack', contact: 'email', email: 'garrymcfadyen@hotmail.com', updateEmail: 'true' }
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
      expect(saveCdoTaskDetails).toHaveBeenCalledWith('ED20001', 'emailApplicationPack', {
        ...options.payload,
        updateEmail: true
      }, userWithDisplayname)
    })

    test('sends application pack if called with post', async () => {
      saveCdoTaskDetails.mockResolvedValue({
        firstName: 'Garry',
        lastName: 'McFadyen',
        addressLine1: '122 Common Road',
        addressLine2: '',
        town: 'Bexhill-on-Sea',
        postcode: 'TN39 4JB'
      })

      const options = {
        method: 'POST',
        url: '/cdo/manage/task/send-application-pack/ED20001',
        auth,
        payload: { taskName: 'send-application-pack', contact: 'post' }
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
      expect(saveCdoTaskDetails).toHaveBeenCalledWith('ED20001', 'postApplicationPack', {
        ...options.payload,
        updateEmail: false
      }, userWithDisplayname)
    })

    test('handles non-ApiErrorFailure boom from API', async () => {
      const options = {
        method: 'POST',
        url: '/cdo/manage/task/send-application-pack/ED20001',
        auth,
        payload: { taskName: 'send-application-pack', contact: 'post' }
      }
      saveCdoTaskDetails.mockImplementation(() => {
        throw new Error('dummy error')
      })
      const response = await server.inject(options)
      expect(response.statusCode).toBe(500)
    })
  })

  describe('POST /cdo/manage/task/process-application-pack/ED20001', () => {
    test('returns 302 if not auth', async () => {
      const fd = new FormData()

      const options = {
        method: 'POST',
        url: '/cdo/manage/task/process-application-pack/ED20001',
        headers: fd.getHeaders(),
        payload: fd.getBuffer()
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })

    test('fails validation if invalid payload', async () => {
      const options = {
        method: 'POST',
        url: '/cdo/manage/task/process-application-pack/ED20001',
        auth,
        payload: { taskName: 'process-application-pack' }
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(400)
    })

    test('saves if valid payload', async () => {
      saveCdoTaskDetails.mockResolvedValue()
      const options = {
        method: 'POST',
        url: '/cdo/manage/task/process-application-pack/ED20001',
        auth,
        payload: { taskName: 'process-application-pack', taskDone: 'Y' }
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
      expect(saveCdoTaskDetails).toHaveBeenCalledWith('ED20001', 'processApplicationPack', options.payload, userWithDisplayname)
    })

    test('handles boom from API', async () => {
      const options = {
        method: 'POST',
        url: '/cdo/manage/task/process-application-pack/ED20001',
        auth,
        payload: { taskName: 'process-application-pack', taskDone: 'Y' }
      }
      saveCdoTaskDetails.mockImplementation(() => {
        throw new ApiErrorFailure('dummy error', { payload: { microchipNumber: '12345', microchipNumbers: [] } })
      })
      const response = await server.inject(options)
      expect(response.statusCode).toBe(400)
    })

    test('handles non-ApiErrorFailure boom from API', async () => {
      const options = {
        method: 'POST',
        url: '/cdo/manage/task/process-application-pack/ED20001',
        auth,
        payload: { taskName: 'process-application-pack', taskDone: 'Y' }
      }
      saveCdoTaskDetails.mockImplementation(() => {
        throw new Error('dummy error')
      })
      const response = await server.inject(options)
      expect(response.statusCode).toBe(500)
    })
  })

  describe('POST /cdo/manage/task/record-verification-dates/ED20001', () => {
    test('POST /cdo/manage/task/record-verification-dates/ED20001 route returns 302 given microchip call', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromInitial())
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'POST',
        url: '/cdo/manage/task/record-verification-dates/ED20001',
        auth,
        payload: {
          'microchipVerification-day': '',
          'microchipVerification-month': '',
          'microchipVerification-year': '',
          dogNotFitForMicrochip: true,
          'neuteringConfirmation-day': '',
          'neuteringConfirmation-month': '',
          'neuteringConfirmation-year': '',
          dogNotNeutered: true,
          taskName: 'record-verification-dates',
          microchipVerification: { year: '', month: '', day: '' },
          neuteringConfirmation: { year: '', month: '', day: '' }
        }
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
      expect(setVerificationPayload).toHaveBeenCalledWith(expect.anything(), {
        dogNotFitForMicrochip: true,
        dogNotNeutered: true,
        taskName: 'record-verification-dates',
        microchipVerification: { year: '', month: '', day: '' },
        neuteringConfirmation: { year: '', month: '', day: '' },
        'neuteringConfirmation-day': '',
        'neuteringConfirmation-month': '',
        'neuteringConfirmation-year': '',
        'microchipVerification-day': '',
        'microchipVerification-month': '',
        'microchipVerification-year': ''
      })
    })
  })

  describe('POST /cdo/manage/task/record-microchip-deadline/ED20001', () => {
    test('POST /cdo/manage/task/record-verification-dates/ED20001 route returns 302 given microchip call', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromInitial())
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })
      saveCdoTaskDetails.mockResolvedValue({})

      const options = {
        method: 'POST',
        url: '/cdo/manage/task/record-microchip-deadline/ED20001',
        auth,
        payload: {
          'microchipDeadline-day': '27',
          'microchipDeadline-month': '12',
          'microchipDeadline-year': '9999',
          taskName: 'record-microchip-deadline',
          dogNotFitForMicrochip: '',
          dogNotNeutered: '',
          'microchipVerification-day': '',
          'microchipVerification-month': '',
          'microchipVerification-year': '',
          'neuteringConfirmation-day': '',
          'neuteringConfirmation-month': '',
          'neuteringConfirmation-year': '',
          microchipDeadline: '2024-12-27T00:00:00.000Z'
        }
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
      expect(clearVerificationPayload).toHaveBeenCalled()
    })
  })

  describe('GET /cdo/manage/task/record-microchip-deadline', () => {
    test('saves if valid payload', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromComplete({
        microchipDeadline: '2025-11-29T00:00:00.000Z'
      }))
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })
      getVerificationPayload.mockReturnValue(buildVerificationPayload({
        neuteringConfirmation: { year: '2026', month: '01', day: '01' },
        microchipVerification: { year: '', month: '', day: '' },
        dogNotFitForMicrochip: true,
        dogNotNeutered: false
      }))

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/record-microchip-deadline/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelector('#main-content .govuk-fieldset__heading').textContent.trim()).toBe('When will the dog be fit to be microchipped?')
      expect(document.querySelector('#main-content .govuk-hint').textContent.trim()).toBe('Enter the date provided by the vet.')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toBe('Save and continue')
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
