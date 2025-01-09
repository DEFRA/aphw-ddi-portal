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
      'neuteringDeadline-day': '31',
      'neuteringDeadline-month': '12',
      'neuteringDeadline-year': '2024',
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

  test('should pass validation when 2015 and interim exempt and no cdo issued', () => {
    const payload = {
      indexNumber: 'ED1234',
      exemptionOrder: 2015,
      status: 'Interim exempt',
      'cdoIssued-day': '',
      'cdoIssued-month': '',
      'cdoIssued-year': '',
      'cdoExpiry-day': '',
      'cdoExpiry-month': '',
      'cdoExpiry-year': '',
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
      exemptionOrder: 2015,
      status: 'Interim exempt',
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

  test('should fail validation when 2023 and no neutering deadline exists', () => {
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

    expect(() => validatePayload(payload)).toThrow('Enter a neutering deadline')
  })

  test('should fail validation when 2015 and not interim exempt and no cdo issued', () => {
    const payload = {
      indexNumber: 'ED1234',
      exemptionOrder: 2015,
      status: 'Pre-exempt',
      'cdoIssued-day': '',
      'cdoIssued-month': '',
      'cdoIssued-year': '',
      'cdoExpiry-day': '',
      'cdoExpiry-month': '',
      'cdoExpiry-year': '',
      court: 'court1',
      policeForce: 'policeForce1',
      legislationOfficer: 'Legislation Officer',
      insuranceCompany: 'company1',
      'insuranceRenewal-day': '31',
      'insuranceRenewal-month': '12',
      'insuranceRenewal-year': '2020'
    }

    expect(() => validatePayload(payload)).toThrow('Enter an issue date')
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
      'neuteringDeadline-day': '31',
      'neuteringDeadline-month': '12',
      'neuteringDeadline-year': '9999',
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
      'neuteringDeadline-day': '31',
      'neuteringDeadline-month': '12',
      'neuteringDeadline-year': '9999',
      court: 'court1',
      policeForce: 'policeForce1',
      legislationOfficer: 'Legislation Officer',
      insuranceCompany: 'company1'
    }

    expect(() => validatePayload(payload)).toThrow('Enter a renewal date')
  })

  test('should fail validation with multiple errors when insurance details blanked', () => {
    const payload = {
      indexNumber: 'ED1234',
      exemptionOrder: 2023,
      status: 'DOG_IMPORTED',
      'cdoIssued-day': '31',
      'cdoIssued-month': '12',
      'cdoIssued-year': '2020',
      'neuteringDeadline-day': '31',
      'neuteringDeadline-month': '12',
      'neuteringDeadline-year': '9999',
      'cdoExpiry-day': '31',
      'cdoExpiry-month': '12',
      'cdoExpiry-year': '2020',
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

    expect(() => validatePayload(payload)).toThrow('Select an insurance company')
    try {
      validatePayload(payload)
    } catch (err) {
      expect(err.message).toBe('Select an insurance company')
      expect(err.details.length).toBe(2)
      expect(err.details[0].message).toBe('Select an insurance company')
      expect(err.details[1].message).toBe('Enter a renewal date')
    }
  })

  test('should fail validation with multiple errors when insurance details blanked and other errors', () => {
    const payload = {
      indexNumber: 'ED1234',
      exemptionOrder: 2023,
      status: 'DOG_IMPORTED',
      'cdoIssued-day': 'a',
      'cdoIssued-month': '12',
      'cdoIssued-year': '2020',
      'cdoExpiry-day': '31',
      'cdoExpiry-month': '12',
      'cdoExpiry-year': '2020',
      'neuteringDeadline-day': '31',
      'neuteringDeadline-month': '12',
      'neuteringDeadline-year': '9999',
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

    expect(() => validatePayload(payload)).toThrow('"cdoIssued-day" must be a number')
    try {
      validatePayload(payload)
    } catch (err) {
      expect(err.message).toBe('"cdoIssued-day" must be a number')
      expect(err.details.length).toBe(3)
      expect(err.details[0].message).toBe('"cdoIssued-day" must be a number')
      expect(err.details[1].message).toBe('Select an insurance company')
      expect(err.details[2].message).toBe('Enter a renewal date')
    }
  })
})
