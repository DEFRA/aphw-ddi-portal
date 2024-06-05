describe('Delete Owners validation', () => {
  const { deleteOwnersQuerySchema } = require('../../../../../app/schema/portal/admin/delete/owners')

  test('should pass validation when payload valid for type dog', () => {
    const queryParams = {}

    const { value } = deleteOwnersQuerySchema.validate(queryParams)

    expect(value).toMatchObject({
      sortOrder: 'ASC',
      sortKey: 'name'
    })
  })

  test('should pass validation with sort key and order', () => {
    const queryParams = {
      sortKey: 'address',
      sortOrder: 'DESC'
    }

    const { value } = deleteOwnersQuerySchema.validate(queryParams)

    expect(value).toMatchObject({
      sortKey: 'address',
      sortOrder: 'DESC'
    })
  })

  test.each(
    ['name', 'indexNumber', 'dateOfBirth', 'address', 'selected']
  )('should pass validation when query param is %s', (sortKey) => {
    const params = { sortKey }

    const { value, error } = deleteOwnersQuerySchema.validate(params)

    expect(value).toMatchObject({ sortKey, sortOrder: 'ASC' })
    expect(error).toBeUndefined()
  })

  test('should fail validation with invalid query param', () => {
    const params = {
      param: 'unknown'
    }

    const { error } = deleteOwnersQuerySchema.validate(params)

    expect(error).not.toBeUndefined()
  })

  test('should fail validation with invalid sort order', () => {
    const params = {
      sortOrder: 'unknown'
    }

    const { error } = deleteOwnersQuerySchema.validate(params)

    expect(error).not.toBeUndefined()
  })
})
