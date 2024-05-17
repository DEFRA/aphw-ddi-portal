const { Readable } = require('stream')
const { blobServiceClient } = require('../../../../../app/storage/get-blob-client')
const { downloadBlob } = require('../../../../../app/storage/repos/download-blob')
const { uploadRegisterFile } = require('../../../../../app/storage/repos/register-blob')

const streamToBuffer = async (readableStream) => {
  return new Promise((resolve, reject) => {
    const chunks = []
    readableStream.on('data', (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data))
    })
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    readableStream.on('error', reject)
  })
}

describe('register blob functions', () => {
  beforeAll(async () => {
    const container = blobServiceClient.getContainerClient('certificates')
    await container.createIfNotExists()
  })

  test('should download blob', async () => {
    const filename = 'test.xlsx'
    const stream = new Readable()
    stream.push('test stream')
    stream.push(null)

    await uploadRegisterFile('certificates', filename, stream)

    const res = await downloadBlob('certificates', filename)

    const downloaded = await streamToBuffer(res.readableStreamBody)
    expect(downloaded.toString()).toEqual('test stream')
  })

  test('should throw when not exists', async () => {
    await expect(downloadBlob('certificates', 'not-found.csv')).rejects.toThrow('File not-found.csv does not exist')
  })
})
