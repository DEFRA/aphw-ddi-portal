const { manageCdosGetschema } = require('../../../../../app/schema/portal/cdo/manage')

describe('Manage CDOs tab navigation', () => {
  test('should pass validation when tab is undefined', () => {
    const params = {}

    const { value } = manageCdosGetschema.validate(params)

    expect(value).toMatchObject({
      tab: 'live'
    })
  })

  test.each(
    ['live', 'expired', 'due', 'interim']
  )('should pass validation when tab is %s', (tab) => {
    const params = { tab }

    const { value, error } = manageCdosGetschema.validate(params)

    expect(value).toMatchObject({ tab })
    expect(error).toBeUndefined()
  })

  test('should fail validation with invalid tab', () => {
    const params = {
      tab: 'unknown'
    }

    const { error } = manageCdosGetschema.validate(params)

    expect(error).not.toBeUndefined()
  })
})
