const { buildExemptionDetailsUpdatePayload } = require('../../../app/lib/payload-builders')

describe('PayloadBuilders', () => {
  test('removes insurance if no relevant values', () => {
    const res = buildExemptionDetailsUpdatePayload({
      indexNumber: 'ED12345',
      cdoIssued: '2024-01-01',
      cdoExpiry: '2024-03-01'
    })
    expect(res).toEqual({
      indexNumber: 'ED12345',
      cdoIssued: '2024-01-01',
      cdoExpiry: '2024-03-01'
    })
    expect(res.insurance).toBe(undefined)
  })

  test('constructs insurance if one relevant value', () => {
    const res = buildExemptionDetailsUpdatePayload({
      indexNumber: 'ED12345',
      cdoIssued: '2024-01-01',
      cdoExpiry: '2024-03-01',
      insuranceCompany: 'Insurance Company'
    })
    expect(res).toEqual({
      indexNumber: 'ED12345',
      cdoIssued: '2024-01-01',
      cdoExpiry: '2024-03-01',
      insurance: {
        company: 'Insurance Company'
      }
    })
  })

  test('constructs insurance if two relevant values', () => {
    const res = buildExemptionDetailsUpdatePayload({
      indexNumber: 'ED12345',
      cdoIssued: '2024-01-01',
      cdoExpiry: '2024-03-01',
      insuranceCompany: 'Insurance Company',
      insuranceRenewal: '2025-01-01'
    })
    expect(res).toEqual({
      indexNumber: 'ED12345',
      cdoIssued: '2024-01-01',
      cdoExpiry: '2024-03-01',
      insurance: {
        company: 'Insurance Company',
        renewalDate: '2025-01-01'
      }
    })
  })
})
