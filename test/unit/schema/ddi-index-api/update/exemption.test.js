const { UTCDate } = require('@date-fns/utc')

describe('Exemption details validation', () => {
  const { exemption } = require('../../../../../app/schema/ddi-index-api/exemption/update')

  test('should pass validation when payload valid', () => {
    const payload = {
      indexNumber: 'ED123',
      exemptionOrder: '2015',
      cdoIssued: new UTCDate('2020-02-01'),
      cdoExpiry: new UTCDate('2020-05-01'),
      court: 'Some court',
      policeForce: 'Some police force'
    }

    const { value } = exemption.validate(payload, { abortEarly: false })

    expect(value).toMatchObject({
      indexNumber: 'ED123',
      exemptionOrder: '2015',
      cdoIssued: new UTCDate('2020-02-01'),
      cdoExpiry: new UTCDate('2020-05-01'),
      court: 'Some court',
      policeForce: 'Some police force'
    })
  })

  test('should fail validation with invalid payload', () => {
    const payload = {
      indexNumber: 'ED123',
      exemptionOrder: '2015',
      cdoIssued: new UTCDate('2020-02-01'),
      cdoExpiry: new UTCDate('2020-05-01'),
      court: 'Some court'
    }

    const { error } = exemption.validate(payload, { abortEarly: false })
    expect(error).not.toBeNull()

    const messages = error.details.map((detail) => detail.message)
    expect(messages).toContain('"policeForce" is required')
  })
})
