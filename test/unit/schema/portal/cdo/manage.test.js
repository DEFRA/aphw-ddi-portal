const { manageCdosGetschema, manageCdosQueryschema } = require('../../../../../app/schema/portal/cdo/manage')

describe('Manage CDOs', () => {
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

  describe('Manage CDOs sorting', () => {
    test.each(
      [
        ['indexNumber', 'ASC'],
        ['indexNumber', 'DESC'],
        ['joinedExemptionScheme', 'ASC'],
        ['joinedExemptionScheme', 'DESC'],
        ['interimExemptFor', 'ASC'],
        ['interimExemptFor', 'DESC'],
        ['cdoExpiry', 'ASC'],
        ['cdoExpiry', 'DESC'],
        ['owner', 'ASC'],
        ['owner', 'DESC'],
        ['policeForce', 'ASC'],
        ['policeForce', 'DESC']
      ]
    )('should pass validation when sort key is %s and order is %s', (sortKey, sortOrder) => {
      const params = { sortKey, sortOrder }

      const { value, error } = manageCdosQueryschema.validate(params)

      expect(value).toMatchObject({
        sortKey,
        sortOrder
      })
      expect(error).toBeUndefined()
    })

    test.each(
      [
        ['indexNumber'],
        ['joinedExemptionScheme'],
        ['cdoExpiry'],
        ['owner'],
        ['policeForce']
      ]
    )('should pass validation when sort key is %s and order is undefined', (sortKey) => {
      const params = { sortKey }

      const { value, error } = manageCdosQueryschema.validate(params)

      expect(value).toMatchObject({
        sortKey
      })
      expect(error).toBeUndefined()
    })

    test('should default to undefined, ASC', () => {
      const params = {}

      const { value, error } = manageCdosQueryschema.validate(params)

      expect(value).toMatchObject({})
      expect(error).toBeUndefined()
    })

    test('should not validate if sort key is invalid', () => {
      const params = { sortKey: 'unknown' }

      const { error } = manageCdosQueryschema.validate(params)

      expect(error).not.toBeUndefined()
    })

    test('should not validate if sort order is invalid', () => {
      const params = { sortKey: 'owner', sortOrder: 'ASCENDING' }

      const { error } = manageCdosQueryschema.validate(params)

      expect(error).not.toBeUndefined()
    })
  })
})
