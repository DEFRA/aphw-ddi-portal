const { singleSubmitSchemaConfirm, singleSubmitSchema } = require('../../../../../app/schema/portal/common/single-submit')
const { ValidationError } = require('joi')
describe('singleSubmit', () => {
  describe('singleSubmitSchema', () => {
    test('should validate if payload includes a court', () => {
      const requestPayload = {
        court: 'Rivendell Magistrates Court'
      }
      const courtSchema = singleSubmitSchema('court', 'Court')
      const { error, value } = courtSchema.validate(requestPayload)

      expect(value).toEqual({
        court: 'Rivendell Magistrates Court'
      })
      expect(error).toBeUndefined()
    })

    test('should not validate if payload is empty', () => {
      const requestPayload = {}
      const courtSchema = singleSubmitSchema('court', 'Court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toEqual(new ValidationError('Court is required'))
    })
  })

  describe('singleSubmitSchemaConfirm', () => {
    test('should validate if payload includes a court and confirm', () => {
      const requestPayload = {
        court: 'Rivendell Magistrates Court',
        confirm: 'Y',
        confirmation: 'true'
      }
      const courtSchema = singleSubmitSchemaConfirm('court')
      const { error, value } = courtSchema.validate(requestPayload)

      expect(error).toBeUndefined()
      expect(value).toEqual({
        court: 'Rivendell Magistrates Court',
        confirm: true,
        confirmation: true
      })
    })

    test('should not validate if payload is empty', () => {
      const requestPayload = {}
      const courtSchema = singleSubmitSchemaConfirm('court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toBeInstanceOf(ValidationError)
    })

    test('should not validate if payload is missing a confirm option', () => {
      const requestPayload = {
        court: 'Rivendell Magistrates Court'
      }
      const courtSchema = singleSubmitSchemaConfirm('court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toEqual(new ValidationError('Select an option'))
    })
  })
})
