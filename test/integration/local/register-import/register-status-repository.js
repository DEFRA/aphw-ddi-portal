const { tableClient } = require('../../../../app/storage/get-table-client')
const { getLatestUpdate, setUploaded } = require('../../../../app/storage/register-status-repository')

describe('register status table repository', () => {
  beforeAll(async () => {
    jest.resetAllMocks()

    tableClient.createTable()
  })

  test('getLatestUpdate should return last inserted status update', async () => {
    const filename = 'test-latest-update'

    let mockDate = new Date(1700143099000)
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate)
    await setUploaded(filename, 'test@example.com')

    mockDate = new Date(1700143100000)
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate)
    await setUploaded(filename, 'test@example.com')

    const update = await getLatestUpdate(filename)

    expect(update).toBeDefined()
    expect(update.updatedAt).toBe('2023-11-16T13:58:20.000Z')
  })
})
