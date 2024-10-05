const { submitEmailSchema, submitEmailConflictSchema } = require('../../../../../../app/schema/portal/admin/users')
const { ValidationError } = require('joi')
describe('users schema', () => {
  describe('submitEmailSchema', () => {
    test('should validate with successful request', () => {
      const payload = {
        policeUser: 'chuck.norris@texas.police.gov'
      }
      const { value, error } = submitEmailSchema.validate(payload)
      expect(value).toEqual(payload)
      expect(error).toBeUndefined()
    })

    test('should not validate with successful request', () => {
      const payload = {
        policeUser: ''
      }
      const { value, error } = submitEmailSchema.validate(payload)
      expect(value).toEqual(payload)
      expect(error).toEqual(new ValidationError('Enter a police officer'))
    })

    test('should not validate with a non-email', () => {
      const payload = {
        policeUser: 'not.an.email'
      }
      const { value, error } = submitEmailSchema.validate(payload)
      expect(value).toEqual(payload)
      expect(error).toEqual(new ValidationError('Email address must be real'))
    })
  })
})
