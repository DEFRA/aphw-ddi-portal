const { errorPusherDefault, errorPusherWithDate } = require('../../../app/lib/error-helpers')

describe('ErrorHelpers', () => {
  test('errorPusherDefault handles no errors', () => {
    const errors = null
    const model = {}
    errorPusherDefault(errors, model)
    expect(model.errors).toBe(undefined)
  })

  test('errorPusherDefault handles single error', () => {
    const errors = { details: [{ path: ['field1'], message: 'Custom error message text' }] }
    const model = { field1: '123', errors: [] }
    errorPusherDefault(errors, model)
    expect(model.errors).toEqual([{ href: '#field1', text: 'Custom error message text' }])
  })

  test('errorPusherDefault handles single error using context-path', () => {
    const errors = { details: [{ path: [null], context: { path: ['field1'] }, message: 'Custom error message text' }] }
    const model = { field1: '123', errors: [] }
    errorPusherDefault(errors, model)
    expect(model.errors).toEqual([{ href: '#field1', text: 'Custom error message text' }])
  })

  test('errorPusherDefault doesnt add error when field not in model', () => {
    const errors = { details: [{ path: ['field1'], message: 'Custom error message text' }] }
    const model = { field2: '123', errors: [] }
    errorPusherDefault(errors, model)
    expect(model.errors).toEqual([])
  })

  test('errorPusherWithDate handles no errors', () => {
    const errors = null
    const model = {}
    errorPusherWithDate(errors, model)
    expect(model.errors).toBe(undefined)
  })

  test('errorPusherWithDate handles single error', () => {
    const errors = { details: [{ path: ['field1'], message: 'Custom error message text' }] }
    const model = { field1: '123', errors: [] }
    errorPusherWithDate(errors, model)
    expect(model.errors).toEqual([{ href: '#field1', text: 'Custom error message text' }])
  })

  test('errorPusherWithDate handles single error using context-path', () => {
    const errors = { details: [{ path: [null], context: { path: ['field1'] }, message: 'Custom error message text' }] }
    const model = { field1: '123', errors: [] }
    errorPusherWithDate(errors, model)
    expect(model.errors).toEqual([{ href: '#field1', text: 'Custom error message text' }])
  })

  test('errorPusherWithDate doesnt add error when field not in model', () => {
    const errors = { details: [{ path: ['field1'], message: 'Custom error message text' }] }
    const model = { field2: '123', errors: [] }
    errorPusherWithDate(errors, model)
    expect(model.errors).toEqual([])
  })

  test('errorPusherWithDate handles single error when a date', () => {
    const errors = { details: [{ path: ['field1', 'month'], message: 'Custom error message text' }] }
    const model = { field1: { value: '2020-01-01', type: 'date', items: ['month'] }, errors: [] }
    errorPusherWithDate(errors, model)
    expect(model.errors).toEqual([{ href: '#field1-month', text: 'Custom error message text' }])
  })
})
