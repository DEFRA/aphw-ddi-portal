const { blobServiceClient } = require('../../../../app/storage/get-blob-client')
const { uploadRegisterFile } = require('../../../../app/storage/register-blob-repository')

describe('register blob functions', () => {
  test('should create container on module import', async () => {
    const container = blobServiceClient.getContainerClient('register-import')
    const exists = await container.exists()

    expect(exists).toBeDefined()
    expect(exists).toEqual(true)
  })

  test('should upload register file', async () => {
    const filename = 'test.xlsx'
    const stream = 'test stream'

    const blob = await uploadRegisterFile(filename, stream)

    const container = blobServiceClient.getContainerClient('register-import')
    const blobClient = container.getBlockBlobClient(filename)
    const res = await blobClient.download(0)

    expect(blob).toBeDefined()

    expect(res.readableStreamBody).toBeDefined()
    expect(res.readableStreamBody).toEqual(stream)
  })
})
