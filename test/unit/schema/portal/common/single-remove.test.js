const {
  isInputFieldPkInPayload, confirmFlowValidFields, notFoundSchema, areYouSureRemoveSchema
} = require('../../../../../app/schema/portal/common/single-remove')
const { ValidationError } = require('joi')
describe('singleRemove', () => {
  describe('confirmFlowValidFields', () => {
    test('should validate given correct fields are added', () => {
      const requestPayload = {
        court: 'Rivendell Magistrates Court',
        confirm: 'Y',
        pk: '111',
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
        pk: '111',
        confirmation: 'true',
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
        pk: '111'
      }
      const courtSchema = isInputFieldPkInPayload('Court')
      const { error, value } = courtSchema.validate(requestPayload)

      expect(value).toEqual({
        pk: 111
      })
      expect(error).toBeUndefined()
    })

    test('should not validate if payload is empty', () => {
      const requestPayload = {}
      const courtSchema = isInputFieldPkInPayload('Court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toEqual(new ValidationError('Enter the court'))
      expect(error.details.length).toBe(1)
    })

    test('should give correct error message', () => {
      const requestPayload = {}
      const courtSchema = isInputFieldPkInPayload('Activity')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toEqual(new ValidationError('Enter the activity'))
      expect(error.details.length).toBe(1)
    })

    test('should not validate if court id is empty', () => {
      const requestPayload = {
        pk: ''
      }
      const courtSchema = isInputFieldPkInPayload('Court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toEqual(new ValidationError('Enter the court'))
      expect(error.details.length).toBe(1)
    })
  })

  describe('areYouSureRemoveSchema', () => {
    test('should validate if confirm has been selected', () => {
      const requestPayload = {
        court: 'Rivendell Magistrates Court',
        pk: '111',
        confirm: 'Y'
      }
      const courtSchema = areYouSureRemoveSchema('court')
      const { error, value } = courtSchema.validate(requestPayload)
      expect(value).toEqual({
        court: 'Rivendell Magistrates Court',
        pk: 111,
        confirm: true
      })
      expect(error).toBeUndefined()
    })

    test('should not validate if confirm has need been selected', () => {
      const requestPayload = {
        court: 'Rivendell Magistrates Court',
        pk: '111'
      }
      const courtSchema = areYouSureRemoveSchema('court')
      const { error } = courtSchema.validate(requestPayload)
      expect(error.message).toEqual('Select an option')
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
