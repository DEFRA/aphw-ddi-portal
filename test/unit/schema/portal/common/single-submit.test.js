const { hasAreYouSureRadioBeenSelected, hasConfirmationFormBeenSubmitted, isInputFieldInPayload, confirmFlowValidFields } = require('../../../../../app/schema/portal/common/single-submit')
const { ValidationError } = require('joi')
describe('singleSubmit', () => {
  describe('validFields', () => {
    test('should validate given correct fields are added', () => {
      const requestPayload = {
        court: 'Rivendell Magistrates Court',
        confirm: 'Y',
        confirmation: true
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
        extraField: true
      }
      const courtSchema = confirmFlowValidFields('court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).not.toBeUndefined()
    })
  })
  describe('isConfirmationSchema', () => {
    test('should validate if confirmation is true', () => {
      const requestPayload = {
        confirmation: 'true'
      }
      const { error, value } = hasConfirmationFormBeenSubmitted.validate(requestPayload)

      expect(value).toEqual({
        confirmation: true
      })
      expect(error).toBeUndefined()
    })

    test('should not validate given confirmation is false', () => {
      const requestPayload = {
        confirmation: 'false'
      }
      const { error } = hasConfirmationFormBeenSubmitted.validate(requestPayload)

      expect(error).not.toBeUndefined()
    })

    test('should not validate if payload is empty', () => {
      const requestPayload = {}
      const { error } = hasConfirmationFormBeenSubmitted.validate(requestPayload)

      expect(error).not.toBeUndefined()
    })
  })

  describe('singleSubmitSchema', () => {
    test('should validate if payload includes a court', () => {
      const requestPayload = {
        court: 'Rivendell Magistrates Court'
      }
      const courtSchema = isInputFieldInPayload('court', 'Court')
      const { error, value } = courtSchema.validate(requestPayload)

      expect(value).toEqual({
        court: 'Rivendell Magistrates Court'
      })
      expect(error).toBeUndefined()
    })

    test('should not validate if payload is empty', () => {
      const requestPayload = {}
      const courtSchema = isInputFieldInPayload('court', 'Court')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toEqual(new ValidationError('Enter a court'))
    })

    test('should give correct error message if field starts with an A', () => {
      const requestPayload = {}
      const courtSchema = isInputFieldInPayload('court', 'Ant')
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toEqual(new ValidationError('Enter an ant'))
    })
  })

  describe('singleSubmitSchemaConfirm', () => {
    test('should validate if payload includes a court and confirm', () => {
      const requestPayload = {
        confirm: 'Y'
      }
      const courtSchema = hasAreYouSureRadioBeenSelected
      const { error, value } = courtSchema.validate(requestPayload)

      expect(error).toBeUndefined()
      expect(value).toEqual({
        confirm: true
      })
    })

    test('should not validate if payload is empty', () => {
      const requestPayload = {}
      const courtSchema = hasAreYouSureRadioBeenSelected
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toBeInstanceOf(ValidationError)
    })

    test('should not validate if confirm payload is not Y or N', () => {
      const requestPayload = {
        confirm: 'Yess'
      }
      const courtSchema = hasAreYouSureRadioBeenSelected
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toBeInstanceOf(ValidationError)
    })

    test('should not validate if payload is missing a confirm option', () => {
      const requestPayload = {
        court: 'Rivendell Magistrates Court'
      }
      const courtSchema = hasAreYouSureRadioBeenSelected
      const { error } = courtSchema.validate(requestPayload)

      expect(error).toEqual(new ValidationError('Select an option'))
    })
  })
})
