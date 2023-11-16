const { tableClient } = require('../../../../app/storage/get-table-client')
const { getLatestUpdate, getAllUpdates, setUploaded } = require('../../../../app/storage/register-status-repository')

describe('register status table repository', () => {
  beforeAll(async () => {
    jest.resetAllMocks()

    await tableClient.createTable()

    jest.useFakeTimers('modern')
  })

  test('getLatestUpdate should return last inserted status update', async () => {
    const filename = 'test-latest-update'

    jest.setSystemTime(new Date('2023-11-16T13:58:19.000Z'))
    await setUploaded(filename, 'test@example.com')

    jest.setSystemTime(new Date('2023-11-16T13:58:20.000Z'))
    await setUploaded(filename, 'test@example.com')

    const update = await getLatestUpdate(filename)

    expect(update).toBeDefined()
    expect(update.updatedAt).toBe('2023-11-16T13:58:20.000Z')
  })

  test('getUpdates should return all updates', async () => {
    const filename = 'test-get-all-updates'

    jest.setSystemTime(new Date('2023-11-16T13:58:19.000Z'))
    await setUploaded(filename, 'test@example.com')

    jest.setSystemTime(new Date('2023-11-16T13:58:20.000Z'))
    await setUploaded(filename, 'test@example.com')

    const updates = await getAllUpdates(filename)

    expect(updates).toBeDefined()
    expect(updates.length).toBe(2)
    expect(updates[0]).toMatchObject({
      partitionKey: 'test-get-all-updates',
      rowKey: '0008638299856900000',
      email: 'test@example.com',
      status: 'uploaded',
      createdOn: '2023-11-16T13:58:20.000Z',
      updatedAt: '2023-11-16T13:58:20.000Z'
    })
    expect(updates[1]).toMatchObject({
      partitionKey: 'test-get-all-updates',
      rowKey: '0008638299856901000',
      email: 'test@example.com',
      status: 'uploaded',
      createdOn: '2023-11-16T13:58:19.000Z',
      updatedAt: '2023-11-16T13:58:19.000Z'
    })
  })

  afterAll(async () => {
    jest.useRealTimers()

    await tableClient.deleteTable()
  })
})
