const {
  isInputFieldAndPkInPayload, confirmFlowValidFields, notFoundSchema
} = require('../../../../../app/schema/portal/common/single-remove')
const { ValidationError } = require('joi')
describe('singleRemove', () => {
  describe('confirmFlowValidFields', () => {
    test('should validate given correct fields are added', () => {
      const requestPayload = {
        court: 'Rivendell Magistrates Court',
        confirm: 'Y',
        deletePk: '123',
        confirmation: 'true'
      }
      const courtSchema = confirmFlowValidFields('court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toBeUndefined()
    })

    test('should not validate given additional fields are passed', () => {
      const requestPayload = {
        court: 'Rivendell Magistrates Court',
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

  describe('isInputFieldAndPkInPayload', () => {
    test('should validate if payload includes a court and court id', () => {
      const requestPayload = {
        court: 'Rivendell Magistrates Court',
        deletePk: '111'
      }
      const courtSchema = isInputFieldAndPkInPayload('court', 'Court')
      const { error, value } = courtSchema.validate(requestPayload)

      expect(value).toEqual({
        court: 'Rivendell Magistrates Court',
        deletePk: 111
      })
      expect(error).toBeUndefined()
    })

    test('should not validate if court id is missing', () => {
      const requestPayload = {
        court: 'Rivendell Magistrates Court'
      }
      const courtSchema = isInputFieldAndPkInPayload('court', 'Court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toEqual(new ValidationError('Please choose a valid court'))
    })

    test('should not validate if court is missing', () => {
      const requestPayload = {
        deletePk: 111
      }
      const courtSchema = isInputFieldAndPkInPayload('court', 'Court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toEqual(new ValidationError('Court is required'))
    })

    test('should not validate if payload is empty', () => {
      const requestPayload = {}
      const courtSchema = isInputFieldAndPkInPayload('court', 'Court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toEqual(new ValidationError('Court is required'))
      expect(error.details.length).toBe(1)
    })
  })

  describe('notFoundSchema', () => {
    test('should produce Validation error if court param is validated', () => {
      const requestPayload = {
        court: 'Rivendell Magistrates Court'
      }
      const courtSchema = notFoundSchema('court', 'Rivendell Magistrates Court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toEqual(new ValidationError('Rivendell Magistrates Court does not exist in the index'))
    })
  })
})
