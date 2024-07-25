const { logError } = require('../../../app/plugins/view-context')

describe('ViewContext plugin', () => {
  test('should throw', () => {
    const err = new Error('view-context-error')
    expect(() => logError(err)).toThrow(err)
  })
})
