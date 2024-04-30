const { validatePayload } = require('../../../../../app/schema/portal/common/do-you-want')
describe('doYouWant', () => {
  describe('douYouWantPayloadSchema', () => {
    test('should validate given option is add', () => {
      const payload = {
        addRemoveCourt: 'add'
      }

      const value = validatePayload(payload)

      expect(value).toMatchObject({
        addRemoveCourt: 'add'
      })
    })

    test('should validate given option is remove', () => {
      const payload = {
        addRemoveCourt: 'remove'
      }

      const value = validatePayload(payload)

      expect(value).toMatchObject({
        addRemoveCourt: 'remove'
      })
    })

    test('should not validate given payload is empty', () => {
      const payload = {}

      expect(() => validatePayload(payload)).toThrow()
    })

    test('should not validate given addRemoveCourt is invalid', () => {
      const payload = {
        addRemoveCourt: 'yes'
      }

      expect(() => validatePayload(payload)).toThrow('Select an option')
    })
  })
})
