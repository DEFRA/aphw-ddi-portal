const { admin } = require('../../../../../../app/auth/permissions')
const FormData = require('form-data')
const { UTCDate } = require('@date-fns/utc')
const { JSDOM } = require('jsdom')

describe('OwnerSummary test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/cdo/owner')
  const { getOwnerDetails, getEnforcementDetails, getAddress } = require('../../../../../../app/session/cdo/owner')

  jest.mock('../../../../../../app/api/ddi-index-api/courts')
  const { getCourts } = require('../../../../../../app/api/ddi-index-api/courts')

  jest.mock('../../../../../../app/api/ddi-index-api/police-forces')
  const { getPoliceForces } = require('../../../../../../app/api/ddi-index-api/police-forces')

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

  test('GET /cdo/create/owner-summary route returns 200 with valid data', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/owner-summary',
      auth
    }

    getOwnerDetails.mockReturnValue({
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: new UTCDate('2000-03-17T00:00:00.000Z')
    })
    getAddress.mockReturnValue({
      addressLine1: '1 Test Street',
      addressLine2: 'Testarea',
      town: 'Testington',
      postcode: 'TS1 1TS'
    })
    getEnforcementDetails.mockReturnValue({
      court: 2,
      policeForce: 5,
      legislationOfficer: 'DLO1'
    })
    getCourts.mockResolvedValue(courtList)
    getPoliceForces.mockResolvedValue(policeForceList)

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = new JSDOM(response.result).window

    const tableRows = document.querySelectorAll('.govuk-summary-list__row')
    expect(tableRows.length).toBe(6)
    expect(tableRows[0].innerHTML.indexOf('John Smith')).toBeGreaterThan(-1)
    expect(tableRows[1].innerHTML.indexOf('17 March 2000')).toBeGreaterThan(-1)
    expect(tableRows[2].innerHTML.indexOf('1 Test Street<br>')).toBeGreaterThan(-1)
    expect(tableRows[2].innerHTML.indexOf('Testarea<br>')).toBeGreaterThan(-1)
    expect(tableRows[2].innerHTML.indexOf('Testington<br>')).toBeGreaterThan(-1)
    expect(tableRows[2].innerHTML.indexOf('TS1 1TS')).toBeGreaterThan(-1)
    expect(tableRows[3].innerHTML.indexOf('court2')).toBeGreaterThan(-1)
    expect(tableRows[4].innerHTML.indexOf('policeForce5')).toBeGreaterThan(-1)
    expect(tableRows[5].innerHTML.indexOf('DLO1')).toBeGreaterThan(-1)
  })

  test('GET /cdo/create/owner-summary route returns 200 with missing data', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/owner-summary',
      auth
    }

    getOwnerDetails.mockReturnValue(null)
    getAddress.mockReturnValue(null)
    getEnforcementDetails.mockReturnValue({
    })
    getCourts.mockResolvedValue(courtList)
    getPoliceForces.mockResolvedValue(policeForceList)

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = new JSDOM(response.result).window

    const tableRows = document.querySelectorAll('.govuk-summary-list__row')
    expect(tableRows.length).toBe(6)
    expect(tableRows[0].innerHTML.indexOf('John Smith')).toBe(-1)
    expect(tableRows[1].innerHTML.indexOf('17 March 2000')).toBe(-1)
    expect(tableRows[4].innerHTML.indexOf('policeForce5')).toBe(-1)
    expect(tableRows[5].innerHTML.indexOf('DLO1')).toBe(-1)
  })

  test('POST /cdo/create/owner-summary route returns 302 if not auth', async () => {
    const fd = new FormData()

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-summary',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})

const courtList = [
  { id: 1, name: 'court1' },
  { id: 2, name: 'court2' },
  { id: 3, name: 'court3' },
  { id: 4, name: 'court4' },
  { id: 5, name: 'court5' },
  { id: 6, name: 'court6' }
]

const policeForceList = [
  { id: 1, name: 'policeForce1' },
  { id: 2, name: 'policeForce2' },
  { id: 3, name: 'policeForce3' },
  { id: 4, name: 'policeForce4' },
  { id: 5, name: 'policeForce5' },
  { id: 6, name: 'policeForce6' }
]
