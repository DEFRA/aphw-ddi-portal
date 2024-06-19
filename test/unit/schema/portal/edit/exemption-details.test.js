describe('Exemption details validation', () => {
  const { UTCDate } = require('@date-fns/utc')
  const { validatePayload } = require('../../../../../app/schema/portal/edit/exemption-details')

  test('should pass validation when payload valid', () => {
    const payload = {
      indexNumber: 'ED1234',
      exemptionOrder: 2023,
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

    const value = validatePayload(payload)

    expect(value).toMatchObject({
      indexNumber: 'ED1234',
      exemptionOrder: 2023,
      status: 'DOG_IMPORTED',
      'cdoIssued-day': 31,
      'cdoIssued-month': 12,
      'cdoIssued-year': 2020,
      'cdoExpiry-day': 31,
      'cdoExpiry-month': 12,
      'cdoExpiry-year': 2020,
      court: 'court1',
      policeForce: 'policeForce1',
      legislationOfficer: 'Legislation Officer',
      insuranceCompany: 'company1',
      'insuranceRenewal-day': 31,
      'insuranceRenewal-month': 12,
      'insuranceRenewal-year': 2020,
      certificateIssued: null,
      applicationFeePaid: null,
      neuteringConfirmation: null,
      microchipVerification: null,
      joinedExemptionScheme: null,
      insuranceRenewal: new UTCDate('2020-12-31'),
      microchipDeadline: null,
      typedByDlo: null,
      withdrawn: null,
      nonComplianceLetterSent: null
    })
  })

  test('should fail validation when insurance company supplied but no renewal date', () => {
    const payload = {
      indexNumber: 'ED1234',
      exemptionOrder: 2023,
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
      'insuranceRenewal-day': '31',
      'insuranceRenewal-month': '12',
      'insuranceRenewal-year': '2020'
    }

    expect(() => validatePayload(payload)).toThrow('Select an insurance company')
  })

  test('should fail validation when no insurance company supplied but renewal date is supplied', () => {
    const payload = {
      indexNumber: 'ED1234',
      exemptionOrder: 2023,
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
      insuranceCompany: 'company1'
    }

    expect(() => validatePayload(payload)).toThrow('Enter an insurance renewal date')
  })
})
