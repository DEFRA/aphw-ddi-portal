describe('Delete Owners validation', () => {
  const { orphanedOwnersQuerySchema, orphanedOwnersPayloadSchema } = require('../../../../../app/schema/portal/admin/delete/owners')

  describe('orphanedOwnersQuerySchema', () => {
    test('should pass validation when payload valid for type dog', () => {
      const queryParams = {}

      const { value } = orphanedOwnersQuerySchema.validate(queryParams)

      expect(value).toMatchObject({
        sortOrder: 'ASC',
        sortKey: 'owner'
      })
    })

    test('should pass validation with sort key and order', () => {
      const queryParams = {
        sortKey: 'address',
        sortOrder: 'DESC'
      }

      const { value } = orphanedOwnersQuerySchema.validate(queryParams)

      expect(value).toMatchObject({
        sortKey: 'address',
        sortOrder: 'DESC'
      })
    })

    test.each(
      ['owner', 'indexNumber', 'birthDate', 'address', 'selected']
    )('should pass validation when query param is %s', (sortKey) => {
      const params = { sortKey }

      const { value, error } = orphanedOwnersQuerySchema.validate(params)

      expect(value).toMatchObject({ sortKey, sortOrder: 'ASC' })
      expect(error).toBeUndefined()
    })

    test('should fail validation with invalid query param', () => {
      const params = {
        param: 'unknown'
      }

      const { error } = orphanedOwnersQuerySchema.validate(params)

      expect(error).not.toBeUndefined()
    })

    test('should fail validation with invalid sort order', () => {
      const params = {
        sortOrder: 'unknown'
      }

      const { error } = orphanedOwnersQuerySchema.validate(params)

      expect(error).not.toBeUndefined()
    })
  })

  describe('orphanedOwnersPayloadSchema', () => {
    test('should validate with an array of owners of length 1', () => {
      const params = {
        checkboxSortCol: '',
        deleteOwner: ['P-2F0B-49E0']
      }

      const { value, error } = orphanedOwnersPayloadSchema.validate(params)

      expect(error).toBeUndefined()
      expect(value).toMatchObject({ deleteOwner: ['P-2F0B-49E0'] })
    })

    test('should validate with an array of owners of length >1', () => {
      const expectedOwners = ['P-2F0B-49E0', 'P-2F0B-49E1', 'P-2F0B-49E2']
      const params = {
        checkboxSortCol: '',
        deleteOwner: expectedOwners
      }

      const { value, error } = orphanedOwnersPayloadSchema.validate(params)

      expect(error).toBeUndefined()
      expect(value).toMatchObject({ deleteOwner: expectedOwners })
    })

    test('should validate with a single owner', () => {
      const params = {
        checkboxSortCol: '',
        deleteOwner: 'P-2F0B-49E0'
      }

      const { value, error } = orphanedOwnersPayloadSchema.validate(params)

      expect(error).toBeUndefined()
      expect(value).toMatchObject({ deleteOwner: ['P-2F0B-49E0'] })
    })
  })
})
