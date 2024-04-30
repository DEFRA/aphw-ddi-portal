const { validatePayload } = require('../../../../../app/schema/portal/common/do-you-want')
describe('doYouWant', () => {
  describe('douYouWantPayloadSchema', () => {
    test('should validate given option is add', () => {
      const payload = {
        addOrRemove: 'add'
      }

      const value = validatePayload(payload)

      expect(value).toMatchObject({
        addOrRemove: 'add'
      })
    })

    test('should validate given option is remove', () => {
      const payload = {
        addOrRemove: 'remove'
      }

      const value = validatePayload(payload)

      expect(value).toMatchObject({
        addOrRemove: 'remove'
      })
    })

    test('should not validate given payload is empty', () => {
      const payload = {}

      expect(() => validatePayload(payload)).toThrow()
    })

    test('should not validate given addOrRemove is invalid', () => {
      const payload = {
        addOrRemove: 'yes'
      }

      expect(() => validatePayload(payload)).toThrow('Select an option')
    })
  })
})
