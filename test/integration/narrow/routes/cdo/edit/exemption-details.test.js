const { expect } = require('@jest/globals')
const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Update dog details', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api')
  const { getCourts, getPoliceForces, getCompanies } = require('../../../../../../app/api/ddi-index-api')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  jest.mock('../../../../../../app/api/ddi-index-api/exemption')
  const { updateExemption } = require('../../../../../../app/api/ddi-index-api/exemption')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    getCourts.mockResolvedValue([
      { courtId: '1', courtName: 'court1' },
      { courtId: '2', courtName: 'court2' }
    ])

    getPoliceForces.mockResolvedValue([
      { policeForceId: '1', policeForceName: 'policeForce1' },
      { policeForceId: '2', policeForceName: 'policeForce2' }
    ])

    getCompanies.mockResolvedValue([
      { companyId: '1', companyName: 'company1' },
      { companyId: '2', companyName: 'company2' }
    ])

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/edit/exemption-details/ED1234 route returns 200', async () => {
    getCdo.mockResolvedValue({
      dog: {
        indexNumber: 'ED1234',
        name: 'Doggo',
        breed: 'Labrador',
        status: 'In breach',
        breaches: [
          'dog not covered by third party insurance',
          'dog not kept on lead or muzzled',
          'dog kept in insecure place'
        ]
      },
      exemption: {
        indexNumber: 'ED1234',
        cdoIssued: '2020-01-01',
        cdoExpiry: '2020-02-01',
        court: 'court1',
        policeForce: 'policeForce1',
        legislationOfficer: 'Legislation Officer',
        certificateIssued: '2020-01-01',
        applicationFeePaid: '2020-01-01',
        neuteringConfirmation: '2020-01-01',
        microchipVerification: '2020-01-01',
        joinedExemptionScheme: '2020-01-01',
        insurance: [
          {
            company: 'company1',
            renewalDate: '2020-01-01'
          }
        ]
      }
    })

    const options = {
      method: 'GET',
      url: '/cdo/edit/exemption-details/ED1234',
      auth
    }

    const response = await server.inject(options)
    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelector('.breach-details').textContent.trim()).toContain('dog not covered by third party insurance')
    expect(document.querySelector('.breach-details').textContent.trim()).toContain('dog not kept on lead or muzzled')
    expect(document.querySelector('.breach-details').textContent.trim()).toContain('dog kept in insecure place')
  })

  test('GET /cdo/edit/exemption-details/ED1234 route returns 404 when cdo not found', async () => {
    getCdo.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: '/cdo/edit/exemption-details/ED1234',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  test('POST /cdo/edit/exemption-details route updates exemption', async () => {
    const payload = {
      indexNumber: 'ED1234',
      exemptionOrder: 2015,
      status: 'DOG_IMPORTED',
      'cdoIssued-day': '31',
      'cdoIssued-month': '12',
      'cdoIssued-year': '2020',
      'cdoExpiry-day': '31',
      'cdoExpiry-month': '12',
      'cdoExpiry-year': '2020',
      court: 'court1',
      policeForce: 'policeForce1',
      legislationOfficer: 'Legislation Officer',
      insuranceCompany: 'company1',
      'insuranceRenewal-day': '31',
      'insuranceRenewal-month': '12',
      'insuranceRenewal-year': '2020'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/exemption-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(updateExemption).toHaveBeenCalledTimes(1)
  })

  test('POST /cdo/edit/exemption-details route returns 400 when payload invalid', async () => {
    const payload = {
      indexNumber: 'ED1234'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/exemption-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(400)
  })

  test('POST /cdo/edit/exemption-details route displays error if future cdo issue date', async () => {
    const payload = {
      indexNumber: 'ED1234',
      status: 'DOG_IMPORTED',
      exemptionOrder: 2015,
      'cdoIssued-day': '31',
      'cdoIssued-month': '12',
      'cdoIssued-year': '9999',
      court: 'court1',
      policeForce: 'policeForce1',
      legislationOfficer: 'Legislation Officer',
      insuranceCompany: 'company1'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/exemption-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updateExemption).not.toHaveBeenCalled()
    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
    expect(messages).toContain('Enter a date that is today or in the past')
  })

  test('POST /cdo/edit/exemption-details route displays error if short year', async () => {
    const payload = {
      indexNumber: 'ED1234',
      exemptionOrder: 2015,
      status: 'DOG_IMPORTED',
      'cdoIssued-day': '31',
      'cdoIssued-month': '12',
      'cdoIssued-year': '99',
      court: 'court1',
      policeForce: 'policeForce1',
      legislationOfficer: 'Legislation Officer',
      insuranceCompany: 'company1'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/exemption-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updateExemption).not.toHaveBeenCalled()
    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
    expect(messages).toContain('Enter a 4-digit year')
  })

  test('POST /cdo/edit/exemption-details route displays error if invalid date', async () => {
    const payload = {
      indexNumber: 'ED1234',
      exemptionOrder: 2015,
      status: 'DOG_IMPORTED',
      'cdoIssued-day': '40',
      'cdoIssued-month': '12',
      'cdoIssued-year': '2020',
      court: 'court1',
      policeForce: 'policeForce1',
      legislationOfficer: 'Legislation Officer',
      insuranceCompany: 'company1'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/exemption-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updateExemption).not.toHaveBeenCalled()
    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
    expect(messages).toContain('Enter a real date')
  })

  test('POST /cdo/edit/exemption-details route displays multiple errors if insurance details blanked', async () => {
    const payload = {
      indexNumber: 'ED1234',
      status: 'DOG_IMPORTED',
      exemptionOrder: 2015,
      'cdoIssued-day': '31',
      'cdoIssued-month': '12',
      'cdoIssued-year': '9999',
      court: 'court1',
      policeForce: 'policeForce1',
      legislationOfficer: 'Legislation Officer',
      previousInsuranceCompany: 'Company 1',
      previousInsuranceRenewal: '2024-01-01T12:00:00.000Z',
      insuranceCompany: '',
      'insuranceRenewal-day': '',
      'insuranceRenewal-month': '',
      'insuranceRenewal-year': ''
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/exemption-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updateExemption).not.toHaveBeenCalled()
    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
    expect(messages).toContain('Enter a date that is today or in the past')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
