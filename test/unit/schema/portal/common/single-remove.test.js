const {
  isInputFieldPkInPayload, confirmFlowValidFields, notFoundSchema
} = require('../../../../../app/schema/portal/common/single-remove')
const { ValidationError } = require('joi')
describe('singleRemove', () => {
  describe('confirmFlowValidFields', () => {
    test('should validate given correct fields are added', () => {
      const requestPayload = {
        court: '111',
        confirm: 'Y',
        confirmation: 'true'
      }
      const courtSchema = confirmFlowValidFields('court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toBeUndefined()
    })

    test('should not validate given additional fields are passed', () => {
      const requestPayload = {
        court: '111',
        confirm: 'Y',
        confirmation: true,
        deletePk: '123',
        extraField: true
      }
      const courtSchema = confirmFlowValidFields('court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).not.toBeUndefined()
    })
  })

  describe('isInputFieldPkInPayload', () => {
    test('should validate if payload includes a court and court id', () => {
      const requestPayload = {
        court: '111'
      }
      const courtSchema = isInputFieldPkInPayload('court', 'Court')
      const { error, value } = courtSchema.validate(requestPayload)

      expect(value).toEqual({
        court: 111
      })
      expect(error).toBeUndefined()
    })

    test('should not validate if payload is empty', () => {
      const requestPayload = {}
      const courtSchema = isInputFieldPkInPayload('court', 'Court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toEqual(new ValidationError('Court is required'))
      expect(error.details.length).toBe(1)
    })

    test('should not validate if court id is empty', () => {
      const requestPayload = {
        court: ''
      }
      const courtSchema = isInputFieldPkInPayload('court', 'Court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toEqual(new ValidationError('Court is required'))
      expect(error.details.length).toBe(1)
    })
  })

  describe('notFoundSchema', () => {
    test('should produce Validation error if court param is validated', () => {
      const requestPayload = {
        court: '111'
      }
      const courtSchema = notFoundSchema('court', 'Rivendell Magistrates Court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toEqual(new ValidationError('Rivendell Magistrates Court does not exist in the index'))
    })
  })
})
