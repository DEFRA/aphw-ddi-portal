const { Readable } = require('stream')
const { blobServiceClient } = require('../../../../app/storage/get-blob-client')
const { uploadRegisterFile } = require('../../../../app/storage/register-blob-repository')

describe('register blob functions', () => {
  beforeAll(async () => {
    blobServiceClient.createContainer('register-uploads')
  })

  test('should upload register file', async () => {
    const filename = 'test.xlsx'
    const stream = new Readable()
    stream.push('test stream')
    stream.push(null)

    await uploadRegisterFile(filename, stream)

    const container = blobServiceClient.getContainerClient('register-uploads')
    const blobClient = container.getBlockBlobClient(filename)
    const res = await blobClient.downloadToBuffer()

    expect(res).toBeDefined()
    expect(res.toString()).toEqual('test stream')
  })
})
