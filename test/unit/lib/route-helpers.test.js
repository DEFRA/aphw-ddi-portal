const { throwIfPreConditionError } = require('../../../app/lib/route-helpers')
describe('throwIfPreConditionError', () => {
  test('should throw an error if any of the pre conditions throw an error', () => {
    const request = {
      pre: {
        step1: new Error('some error')
      }
    }
    expect(() => throwIfPreConditionError(request)).toThrow('some error')
  })

  test('should not throw an error if the pre conditions pass', () => {
    const request = {
      pre: {
        step1: 'success'
      }
    }
    expect(() => throwIfPreConditionError(request)).not.toThrow()
  })

  test('should not throw an error if no pre exists', () => {
    const request = {}
    expect(() => throwIfPreConditionError(request)).not.toThrow()
  })
})
