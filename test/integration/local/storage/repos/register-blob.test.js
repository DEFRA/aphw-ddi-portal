const { Readable } = require('stream')
const { blobServiceClient } = require('../../../../../app/storage/get-blob-client')
const { uploadRegisterFile } = require('../../../../../app/storage/repos/register-blob')

describe('register blob functions', () => {
  beforeAll(async () => {
    const container = blobServiceClient.getContainerClient('uploads')
    await container.createIfNotExists()
  })

  test('should upload register file', async () => {
    const filename = 'test.xlsx'
    const stream = new Readable()
    stream.push('test stream')
    stream.push(null)

    await uploadRegisterFile('uploads', filename, stream)

    const container = blobServiceClient.getContainerClient('uploads')
    const blobClient = await container.getBlockBlobClient(filename)
    const res = await blobClient.downloadToBuffer()

    expect(res).toBeDefined()
    expect(res.toString()).toEqual('test stream')
  })
})
