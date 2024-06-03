const { user } = require('../../../mocks/auth')
const { getOldDogs, bulkDeleteDogs } = require('../../../../app/api/ddi-index-api/dogs')

jest.mock('../../../../app/api/ddi-index-api/base')
const { get, post } = require('../../../../app/api/ddi-index-api/base')

describe('Dogs test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getOldDogs calls endpoint with valid params when no sort passed', async () => {
    get.mockResolvedValue()
    await getOldDogs('Exempt,In breach')
    expect(get).toHaveBeenCalledWith('dogs?forPurging=true&statuses=Exempt,In breach&sortKey=status&sortOrder=ASC', { json: true })
  })

  test('getOldDogs calls endpoint with override', async () => {
    get.mockResolvedValue()
    await getOldDogs('Exempt,In breach', {}, '2038-05-01')
    expect(get).toHaveBeenCalledWith('dogs?forPurging=true&statuses=Exempt,In breach&sortKey=status&sortOrder=ASC&today=2038-05-01', { json: true })
  })

  test('bulkDeleteDogs calls endpoint with valid params', async () => {
    get.mockResolvedValue()
    await bulkDeleteDogs(['ED123', 'ED456'], user)
    expect(post).toHaveBeenCalledWith('dogs:batch-delete', { dogPks: ['ED123', 'ED456'] }, user)
  })
})
