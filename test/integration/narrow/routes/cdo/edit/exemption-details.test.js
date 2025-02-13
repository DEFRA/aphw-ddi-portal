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

  test('GET /cdo/edit/exemption-details/ED1234 route returns 200 and specific hint text for field of 2015', async () => {
    getCdo.mockResolvedValue({
      dog: {
        indexNumber: 'ED1234',
        name: 'Doggo',
        breed: 'XL Bully',
        status: 'Exempt'
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
        ],
        exemptionOrder: '2015'
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
    expect(document.querySelector('#neuteringDeadline-hint').textContent.trim()).toBe('The dog must be neutered by this date. The owner must provide evidence of neutering within 28 days.')
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

  test('POST /cdo/edit/exemption-details route should fail given 2023 Dog and no neutering deadline', async () => {
    const payload = {
      'certificateIssued-day': '',
      'certificateIssued-month': '',
      'certificateIssued-year': '',
      policeForce: 'Metropolitan Police Service',
      legislationOfficer: '',
      'applicationFeePaid-day': '1',
      'applicationFeePaid-month': '1',
      'applicationFeePaid-year': '2024',
      insuranceCompany: 'Axa Insurance',
      'insuranceRenewal-day': '1',
      'insuranceRenewal-month': '1',
      'insuranceRenewal-year': '2025',
      'neuteringConfirmation-day': '1',
      'neuteringConfirmation-month': '1',
      'neuteringConfirmation-year': '2024',
      'microchipVerification-day': '',
      'microchipVerification-month': '',
      'microchipVerification-year': '',
      'joinedExemptionScheme-day': '',
      'joinedExemptionScheme-month': '',
      'joinedExemptionScheme-year': '',
      'nonComplianceLetterSent-day': '',
      'nonComplianceLetterSent-month': '',
      'nonComplianceLetterSent-year': '',
      'neuteringDeadline-day': '',
      'neuteringDeadline-month': '',
      'neuteringDeadline-year': '',
      'microchipDeadline-day': '29',
      'microchipDeadline-month': '1',
      'microchipDeadline-year': '2025',
      'typedByDlo-day': '',
      'typedByDlo-month': '',
      'typedByDlo-year': '',
      'withdrawn-day': '',
      'withdrawn-month': '',
      'withdrawn-year': '',
      exemptionOrder: 2023,
      indexNumber: 'ED400146',
      status: 'Pre-exempt',
      dogBreed: 'Pit Bull Terrier',
      previousInsuranceCompany: 'Axa Insurance',
      previousInsuranceRenewal: '2025-01-01T00:00:00.000Z',
      certificateIssued: null,
      applicationFeePaid: '2024-01-01T00:00:00.000Z',
      neuteringConfirmation: '2024-01-01T00:00:00.000Z',
      microchipVerification: null,
      joinedExemptionScheme: null,
      insuranceRenewal: '2025-01-01T00:00:00.000Z',
      neuteringDeadline: null,
      microchipDeadline: '2025-01-29T00:00:00.000Z',
      typedByDlo: null,
      withdrawn: null,
      nonComplianceLetterSent: null
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/exemption-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(updateExemption).not.toHaveBeenCalled()
    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
    expect(messages).toContain('Enter a neutering deadline date')
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
    expect(messages).toContain('Date must be today or in the past')
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
    expect(messages).toContain('Year must include four numbers')
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
    expect(messages).toContain('Date must be a real date')
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
    expect(messages).toContain('Date must be today or in the past')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
