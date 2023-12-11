const { admin } = require('../../../../../../app/auth/permissions')
const { UTCDate } = require('@date-fns/utc')
const { JSDOM } = require('jsdom')

describe('Add dog details', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/cdo')
  const { getCreatedCdo } = require('../../../../../../app/session/cdo')

  const createServer = require('../../../../../../app/server')
  let server

  const auth = { strategy: 'session-auth', credentials: { scope: [admin] } }

  const user = {
    userId: '1',
    username: 'test@example.com'
  }

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/record-created route renders dogs', async () => {
    getCreatedCdo.mockReturnValue({
      owner: {
        firstName: 'John',
        lastName: 'Smith',
        address: {
          addressLine1: '1 Test Street',
          town: 'Test Town',
          postcode: 'TE1 1ST'
        },
        birthDate: new UTCDate('1980-01-01T00:00:00.000Z')
      },
      enforcementDetails: {
        court: 'Test Court',
        policeForce: 'Test Police Force',
        legislationOfficer: 'Joe Bloggs'
      },
      dogs: [{
        indexNumber: 'ED123456',
        breed: 'Breed 1',
        name: 'Bruce',
        cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
        cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
      }, {
        indexNumber: 'ED654321',
        breed: 'Breed 2',
        name: '',
        cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
        cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
      }]
    })

    const options = {
      method: 'GET',
      url: '/cdo/create/record-created',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelector('h1').textContent).toContain('Record created')
    expect(document.querySelectorAll('.govuk-summary-list').length).toBe(3)

    const dogRecords = document.querySelectorAll('.govuk-summary-list')

    expect(dogRecords[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[0].textContent.trim()).toBe('Breed type')
    expect(dogRecords[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[0].textContent.trim()).toBe('Breed 1')
    expect(dogRecords[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[1].textContent.trim()).toBe('Dog name')
    expect(dogRecords[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[1].textContent.trim()).toBe('Bruce')
    expect(dogRecords[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[2].textContent.trim()).toBe('CDO issue date')
    expect(dogRecords[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[2].textContent.trim()).toBe('10 October 2020')
    expect(dogRecords[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[3].textContent.trim()).toBe('CDO expiry date')
    expect(dogRecords[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[3].textContent.trim()).toBe('10 December 2020')

    expect(dogRecords[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[0].textContent.trim()).toBe('Breed type')
    expect(dogRecords[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[0].textContent.trim()).toBe('Breed 2')
    expect(dogRecords[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[1].textContent.trim()).toBe('CDO issue date')
    expect(dogRecords[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[1].textContent.trim()).toBe('10 October 2020')
    expect(dogRecords[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[2].textContent.trim()).toBe('CDO expiry date')
    expect(dogRecords[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[2].textContent.trim()).toBe('10 December 2020')
    expect(dogRecords[1].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[3]).toBeFalsy()
  })

  test('GET /cdo/record-created route renders owner', async () => {
    getCreatedCdo.mockReturnValue({
      owner: {
        firstName: 'John',
        lastName: 'Smith',
        address: {
          addressLine1: '1 Test Street',
          town: 'Test Town',
          postcode: 'TE1 1ST'
        },
        birthDate: new UTCDate('1980-01-01T00:00:00.000Z')
      },
      enforcementDetails: {
        court: 'Test Court',
        policeForce: 'Test Police Force',
        legislationOfficer: 'Joe Bloggs'
      },
      dogs: [{
        indexNumber: 'ED123456',
        breed: 'Breed 1',
        name: 'Bruce',
        cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
        cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
      }]
    })

    const options = {
      method: 'GET',
      url: '/cdo/create/record-created',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelector('h1').textContent).toContain('Record created')
    expect(document.querySelectorAll('.govuk-summary-list').length).toBe(2)

    const ownerRecord = document.querySelectorAll('.govuk-summary-list')[1]

    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[0].textContent.trim()).toBe('Name')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[0].textContent.trim()).toBe('John Smith')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[1].textContent.trim()).toBe('Date of birth')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[1].textContent.trim()).toBe('01 January 1980')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[2].textContent.trim()).toBe('Address')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[3].textContent.trim()).toBe('Court')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[3].textContent.trim()).toBe('Test Court')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[4].textContent.trim()).toBe('Police force')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[4].textContent.trim()).toBe('Test Police Force')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[5].textContent.trim()).toBe('Dog legislation officer')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[5].textContent.trim()).toBe('Joe Bloggs')
  })

  test('GET /cdo/record-created route should not show blank officer', async () => {
    getCreatedCdo.mockReturnValue({
      owner: {
        firstName: 'John',
        lastName: 'Smith',
        address: {
          addressLine1: '1 Test Street',
          town: 'Test Town',
          postcode: 'TE1 1ST'
        },
        birthDate: new UTCDate('1980-01-01T00:00:00.000Z')
      },
      enforcementDetails: {
        court: 'Test Court',
        policeForce: 'Test Police Force',
        legislationOfficer: ''
      },
      dogs: [{
        indexNumber: 'ED123456',
        breed: 'Breed 1',
        name: 'Bruce',
        cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
        cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
      }]
    })

    const options = {
      method: 'GET',
      url: '/cdo/create/record-created',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelector('h1').textContent).toContain('Record created')
    expect(document.querySelectorAll('.govuk-summary-list').length).toBe(2)

    const ownerRecord = document.querySelectorAll('.govuk-summary-list')[1]

    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[0].textContent.trim()).toBe('Name')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[0].textContent.trim()).toBe('John Smith')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[1].textContent.trim()).toBe('Date of birth')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[1].textContent.trim()).toBe('01 January 1980')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[2].textContent.trim()).toBe('Address')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[3].textContent.trim()).toBe('Court')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[3].textContent.trim()).toBe('Test Court')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[4].textContent.trim()).toBe('Police force')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[4].textContent.trim()).toBe('Test Police Force')
    expect(ownerRecord.querySelectorAll('.govuk-summary-list__row .govuk-summary-list__key')[5]).toBeFalsy()
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
