const { singleSubmitSchema } = require('../../../../../app/schema/portal/common/single-submit')
const { ValidationError } = require('joi')
describe('singleSubmit', () => {
  describe('singleSubmitSchema', () => {
    test('should validate if payload includes a court', () => {
      const requestPayload = {
        court: 'Rivendell Magistrates Court'
      }
      const courtSchema = singleSubmitSchema('court')
      const { error, value } = courtSchema.validate(requestPayload)

      expect(value).toEqual({
        court: 'Rivendell Magistrates Court'
      })
      expect(error).toBeUndefined()
    })

    test('should not validate if payload includes a court', () => {
      const requestPayload = {}
      const courtSchema = singleSubmitSchema('court', 'Court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toEqual(new ValidationError('Court is required'))
    })
  })
})
