const { submitEmailSchema, submitListSchema } = require('../../../../../../app/schema/portal/admin/users')
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

  describe('submitListSchema', () => {
    test('should successfully validate with a single user', () => {
      const payload = {
        continue: '',
        users: 'nicholas.angel@sandford.police.uk'
      }

      const { value, error } = submitListSchema.validate(payload)
      expect(value).toEqual({
        continue: '',
        users: ['nicholas.angel@sandford.police.uk']
      })
      expect(error).toBeUndefined()
    })

    test('should successfully validate with an array of users', () => {
      const payload = {
        continue: '',
        users: [
          'nicholas.angel@sandford.police.uk',
          'danny.butterman@sandford.police.uk'
        ]
      }

      const { value, error } = submitListSchema.validate(payload)
      expect(value).toEqual(payload)
      expect(error).toBeUndefined()
    })

    test('should fail with no users', () => {
      const payload = {
        continue: '',
        users: []
      }

      const { value, error } = submitListSchema.validate(payload)
      expect(error).toEqual(new ValidationError('"users" must contain at least 1 items'))
      expect(value).toEqual(payload)
    })

    test('should fail with empty payload', () => {
      const payload = {}

      const { value, error } = submitListSchema.validate(payload)
      expect(error).toEqual(new ValidationError('"continue" is required'))
      expect(value).toEqual(payload)
    })
  })
})
