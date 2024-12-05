const { auth, user } = require('../../../../../mocks/auth')
jest.mock('../../../../../../app/session/session-wrapper')
const { setInSession } = require('../../../../../../app/session/session-wrapper')
const { JSDOM } = require('jsdom')
jest.mock('../../../../../../app/api/ddi-index-api/search')
const { someTasksCompletedButNotYetAvailable } = require('../../../../../mocks/cdo/manage/cdo')
const { buildTaskListFromInitial, buildCdoSummary, buildTaskListFromComplete } = require('../../../../../mocks/cdo/manage/tasks/builder')

const applicationList = [
  'sendApplicationPack',
  'processApplicationPack',
  'recordInsuranceDetails',
  'recordMicrochipNumber',
  'recordApplicationFeePayment',
  'sendForm2',
  'recordVerificationDate'
]

const cdoApplicationPackOrder = {
  sendApplicationPack: applicationList.indexOf('sendApplicationPack'),
  processApplicationPack: applicationList.indexOf('processApplicationPack'),
  recordInsuranceDetails: applicationList.indexOf('recordInsuranceDetails'),
  recordMicrochipNumber: applicationList.indexOf('recordMicrochipNumber'),
  recordApplicationFeePayment: applicationList.indexOf('recordApplicationFeePayment'),
  sendForm2: applicationList.indexOf('sendForm2'),
  recordVerificationDate: applicationList.indexOf('recordVerificationDate')
}

describe('Manage Cdo test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo, getManageCdoDetails } = require('../../../../../../app/api/ddi-index-api/cdo')

  const createServer = require('../../../../../../app/server')
  let server

  setInSession.mockReturnValue()

  const getTaskListItemNameText = (document, item) => document.querySelectorAll('ul.govuk-task-list .govuk-task-list__item')[item].querySelector('.govuk-task-list__name-and-hint').textContent.trim()
  const getTaskListItemStatusText = (document, item) => document.querySelectorAll('ul.govuk-task-list .govuk-task-list__item')[item].querySelector('.govuk-task-list__status').textContent.trim()

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/manage/cdo/ED123 route returns 200', async () => {
    getCdo.mockResolvedValue({
      dog: {
        indexNumber: 'ED20001',
        status: 'Pre-exempt'
      },
      person: {
        personReference: 'P-A133-7E4C'
      },
      exemption: {
        cdoExpiry: new Date('2024-01-20')
      }
    })

    getManageCdoDetails.mockResolvedValue(buildTaskListFromInitial({
      microchipNumber: '673827549000083',
      microchipNumber2: '673827549000084',
      cdoSummary: buildCdoSummary({
        exemption: {
          cdoExpiry: '2024-04-19T00:00:00.000Z'
        },
        person: {
          lastName: 'McFadyen',
          firstName: 'Garry'
        },
        dog: {
          name: 'Kilo'
        }
      })
    }))

    const options = {
      method: 'GET',
      url: '/cdo/manage/cdo/ED123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('h1.govuk-heading-xl').textContent.trim()).toBe('Dog ED20001')
    expect(document.querySelector('span.govuk-body.defra-secondary-text')).toBeNull()
    expect(getTaskListItemNameText(document, cdoApplicationPackOrder.sendApplicationPack)).toBe('Send application pack')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.sendApplicationPack)).toBe('Not yet started')
    expect(getTaskListItemNameText(document, cdoApplicationPackOrder.processApplicationPack)).toBe('Process application')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.processApplicationPack)).toBe('Cannot start yet')
    expect(getTaskListItemNameText(document, cdoApplicationPackOrder.recordInsuranceDetails)).toBe('Record insurance details')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.recordInsuranceDetails)).toBe('Cannot start yet')
    expect(getTaskListItemNameText(document, cdoApplicationPackOrder.recordMicrochipNumber)).toBe('Record microchip number')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.recordMicrochipNumber)).toBe('Cannot start yet')
    expect(getTaskListItemNameText(document, cdoApplicationPackOrder.recordApplicationFeePayment)).toBe('Record application fee payment')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.recordApplicationFeePayment)).toBe('Cannot start yet')
    expect(getTaskListItemNameText(document, cdoApplicationPackOrder.sendForm2)).toBe('Send Form 2')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.sendForm2)).toBe('Cannot start yet')
    expect(getTaskListItemNameText(document, cdoApplicationPackOrder.recordVerificationDate)).toBe('Record the verification date for microchip and neutering')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.recordVerificationDate)).toBe('Cannot start yet')
    expect(document.querySelector('.govuk-tag').textContent.trim()).toBe('Applying for exemption')

    const [dogNameKey, ownerNameKey, microchipNumberKey, cdoExpiryKey] = document.querySelectorAll('.govuk-summary-list__key')
    const [dogName, ownerName, microchipNumber, cdoExpiry] = document.querySelectorAll('.govuk-summary-list__value')
    expect(dogNameKey.textContent.trim()).toBe('Dog name')
    expect(ownerNameKey.textContent.trim()).toBe('Owner name')
    expect(microchipNumberKey.textContent.trim()).toBe('Microchip number')
    expect(cdoExpiryKey.textContent.trim()).toBe('CDO expiry')
    expect(dogName.textContent.trim()).toBe('Kilo')
    expect(ownerName.textContent.trim()).toBe('Garry McFadyen')
    expect(microchipNumber.textContent.trim()).toBe('673827549000083673827549000084')
    expect(cdoExpiry.textContent.trim()).toBe('19 Apr 2024')
  })

  test('GET /cdo/manage/cdo/ED123 route returns 200 given Failed status', async () => {
    getCdo.mockResolvedValue({
      dog: {
        indexNumber: 'ED20001',
        status: 'Failed'
      },
      person: {
        personReference: 'P-A133-7E4C'
      },
      exemption: {
        cdoExpiry: new Date('2024-01-20')
      }
    })

    getManageCdoDetails.mockResolvedValue(buildTaskListFromInitial({
      microchipNumber: '673827549000083',
      microchipNumber2: '673827549000084',
      cdoSummary: buildCdoSummary({
        exemption: {
          cdoExpiry: '2024-04-19T00:00:00.000Z'
        },
        person: {
          lastName: 'McFadyen',
          firstName: 'Garry'
        },
        dog: {
          name: 'Kilo'
        }
      })
    }))

    const options = {
      method: 'GET',
      url: '/cdo/manage/cdo/ED123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('.govuk-tag').textContent.trim()).toBe('Failed to exempt dog')
  })

  test('GET /cdo/manage/cdo/ED123 route returns 200 with completed tasks overriding "Cannot start yet"', async () => {
    getCdo.mockResolvedValue({
      dog: {
        indexNumber: 'ED20001'
      },
      person: {
        personReference: 'P-A133-7E4C'
      },
      exemption: {
        cdoExpiry: new Date('2024-04-19')
      }
    })
    getManageCdoDetails.mockResolvedValue(someTasksCompletedButNotYetAvailable)

    const options = {
      method: 'GET',
      url: '/cdo/manage/cdo/ED123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('h1.govuk-heading-xl').textContent.trim()).toBe('Dog ED20001')

    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.sendApplicationPack)).toBe('Not yet started')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.processApplicationPack)).toBe('Not yet started')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.recordInsuranceDetails)).toBe('Completed on 01 Feb 2024')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.recordMicrochipNumber)).toBe('Completed')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.recordApplicationFeePayment)).toBe('Completed on 02 Mar 2024')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.sendForm2)).toBe('Completed on 03 Apr 2024')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.recordVerificationDate)).toBe('Completed on 10 Apr 2024')

    const [dogName, ownerName, microchipNumber, cdoExpiry] = document.querySelectorAll('.govuk-summary-list__value')
    expect(dogName.textContent.trim()).toBe('Not entered')
    expect(ownerName.textContent.trim()).toBe('Not entered')
    expect(microchipNumber.textContent.trim()).toBe('Not entered')
    expect(cdoExpiry.textContent.trim()).toBe('19 Apr 2024')
  })

  test('GET /cdo/manage/cdo/ED123 route returns 200 with all completed tasks', async () => {
    getCdo.mockResolvedValue({
      dog: {
        indexNumber: 'ED20001'
      },
      person: {
        personReference: 'P-A133-7E4C'
      },
      exemption: {
        cdoExpiry: new Date('2024-04-19')
      }
    })
    getManageCdoDetails.mockResolvedValue(buildTaskListFromComplete({}))

    const options = {
      method: 'GET',
      url: '/cdo/manage/cdo/ED123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('h1.govuk-heading-xl').textContent.trim()).toBe('Dog ED20001')

    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.sendApplicationPack)).toBe('Completed on 27 Nov 2024')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.processApplicationPack)).toBe('Completed on 27 Nov 2024')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.recordInsuranceDetails)).toBe('Completed on 27 Nov 2024')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.recordMicrochipNumber)).toBe('Completed on 27 Nov 2024')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.recordApplicationFeePayment)).toBe('Completed on 27 Nov 2024')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.sendForm2)).toBe('Completed on 27 Nov 2024')
    expect(getTaskListItemStatusText(document, cdoApplicationPackOrder.recordVerificationDate)).toBe('Completed on 27 Nov 2024')

    const [dogName, ownerName, microchipNumber, cdoExpiry] = document.querySelectorAll('.govuk-summary-list__value')
    expect(dogName.textContent.trim()).toBe('Rex300')
    expect(ownerName.textContent.trim()).toBe('Alex Carter')
    expect(microchipNumber.textContent.trim()).toBe('123456789012354')
    expect(cdoExpiry.textContent.trim()).toBe('10 Dec 2023')
  })

  test('GET /cdo/manage/cdo/ED123 route returns 404 when invalid index number', async () => {
    getCdo.mockResolvedValue({
      dog: {
        indexNumber: 'ED20001'
      },
      person: {
        personReference: 'P-A133-7E4C'
      },
      exemption: {
        cdoExpiry: new Date('2024-04-19')
      }
    })
    getManageCdoDetails.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: '/cdo/manage/cdo/ED123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
