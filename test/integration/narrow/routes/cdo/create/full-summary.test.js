const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')
const { UTCDate } = require('@date-fns/utc')
const { JSDOM } = require('jsdom')
const wreck = require('@hapi/wreck')
jest.mock('@hapi/wreck')

describe('FullSummary test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/cdo/owner')
  const { getOwnerDetails, getEnforcementDetails, getAddress } = require('../../../../../../app/session/cdo/owner')

  jest.mock('../../../../../../app/session/cdo/dog')
  const { getDogs } = require('../../../../../../app/session/cdo/dog')

  jest.mock('../../../../../../app/api/ddi-index-api/courts')
  const { getCourts } = require('../../../../../../app/api/ddi-index-api/courts')

  jest.mock('../../../../../../app/api/ddi-index-api/police-forces')
  const { getPoliceForces } = require('../../../../../../app/api/ddi-index-api/police-forces')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/full-summary route returns 200 with valid data', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/full-summary',
      auth
    }

    getDogs.mockReturnValue(
      [
        {
          name: 'Bruce',
          breed: 'Breed 1',
          cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
          cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
        }
      ]
    )

    getOwnerDetails.mockReturnValue({
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: new UTCDate('2000-03-17T00:00:00.000Z')
    })
    getAddress.mockReturnValue({
      addressLine1: '1 Test Street',
      addressLine2: 'Testarea',
      town: 'Testington',
      postcode: 'TS1 1TS',
      country: 'Wales'
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
    expect(tableRows.length).toBe(11)
    expect(tableRows[0].innerHTML.indexOf('John Smith')).toBeGreaterThan(-1)
    expect(tableRows[1].innerHTML.indexOf('17 March 2000')).toBeGreaterThan(-1)
    expect(tableRows[2].innerHTML.indexOf('1 Test Street<br>')).toBeGreaterThan(-1)
    expect(tableRows[2].innerHTML.indexOf('Testarea<br>')).toBeGreaterThan(-1)
    expect(tableRows[2].innerHTML.indexOf('Testington<br>')).toBeGreaterThan(-1)
    expect(tableRows[2].innerHTML.indexOf('TS1 1TS')).toBeGreaterThan(-1)
    expect(tableRows[3].innerHTML.indexOf('Wales')).toBeGreaterThan(-1)
    expect(tableRows[4].innerHTML.indexOf('policeForce5')).toBeGreaterThan(-1)
    expect(tableRows[5].innerHTML.indexOf('DLO1')).toBeGreaterThan(-1)
    expect(tableRows[6].innerHTML.indexOf('court2')).toBeGreaterThan(-1)
    expect(tableRows[7].innerHTML.indexOf('Breed 1')).toBeGreaterThan(-1)
    expect(tableRows[8].innerHTML.indexOf('Bruce')).toBeGreaterThan(-1)
    expect(tableRows[9].innerHTML.indexOf('10 October 2020')).toBeGreaterThan(-1)
    expect(tableRows[10].innerHTML.indexOf('10 December 2020')).toBeGreaterThan(-1)
  })

  test('GET /cdo/create/full-summary route returns 200 with missing data', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/full-summary',
      auth
    }

    getDogs.mockReturnValue([])
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
    expect(tableRows.length).toBe(7)
    expect(tableRows[0].innerHTML.indexOf('John Smith')).toBe(-1)
    expect(tableRows[1].innerHTML.indexOf('17 March 2000')).toBe(-1)
    expect(tableRows[3].innerHTML.indexOf('policeForce5')).toBe(-1)
    expect(tableRows[4].innerHTML.indexOf('DLO1')).toBe(-1)
  })

  test('POST /cdo/create/full-summary route returns 302 if not auth', async () => {
    const fd = new FormData()

    const options = {
      method: 'POST',
      url: '/cdo/create/full-summary',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/create/full-summary route creates CDO', async () => {
    getDogs.mockReturnValue(
      [
        {
          name: 'Bruce',
          breed: 'Breed 1',
          applicationType: 'cdo',
          cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
          cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
        }
      ]
    )

    getOwnerDetails.mockReturnValue({
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '2000-03-17T00:00:00.000Z'
    })
    getAddress.mockReturnValue({
      addressLine1: '1 Test Street',
      addressLine2: 'Testarea',
      town: 'Testington',
      postcode: 'TS1 1TS',
      country: 'Wales'
    })
    getEnforcementDetails.mockReturnValue({
      court: 'court2',
      policeForce: 'police-force-5',
      legislationOfficer: 'DLO1'
    })

    wreck.post.mockResolvedValue({ payload: '{"resultCode": 200}' })

    const options = {
      method: 'POST',
      url: '/cdo/create/full-summary',
      auth,
      payload: {}
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(wreck.post).toHaveBeenCalledWith(expect.anything(),
      {
        payload: {
          dogs: [
            {
              applicationType: 'cdo',
              breed: 'Breed 1',
              cdoExpiry: new Date('2020-12-10T00:00:00.000Z'),
              cdoIssued: new Date('2020-10-10T00:00:00.000Z'),
              interimExemption: undefined,
              name: 'Bruce'
            }
          ],
          enforcementDetails: {
            court: 'court2',
            legislationOfficer: 'DLO1',
            policeForce: 'police-force-5'
          },
          owner: {
            address: {
              addressLine1: '1 Test Street',
              addressLine2: 'Testarea',
              postcode: 'TS1 1TS',
              town: 'Testington',
              country: 'Wales'
            },
            dateOfBirth: '2000-03-17T00:00:00.000Z',
            firstName: 'John',
            lastName: 'Smith'
          }
        }
      })
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
