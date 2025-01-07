const { blobServiceClient } = require('../../../app/storage/get-blob-client')
jest.mock('../../../app/storage/get-blob-client')

const downloadToBufferFn = jest.fn().mockResolvedValue('Buffer-pdf-content')
const downloadFn = jest.fn().mockResolvedValue('12345678-pdf-content')

blobServiceClient.getContainerClient.mockReturnValue({
  createIfNotExists: jest.fn(),
  getBlockBlobClient: jest.fn().mockResolvedValue({
    downloadToBuffer: downloadToBufferFn,
    download: downloadFn,
    exists: jest.fn().mockReturnValue(true)
  })
})

const { downloadBlob } = require('../../../app/storage/repos/download-blob')

describe('storage download-blob', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('downloadBlob', () => {
    test('should download file if exists and not buffered', async () => {
      const res = await downloadBlob('containerName', 'filename', false)
      expect(res).not.toBe(null)
      expect(downloadFn).toHaveBeenCalled()
      expect(downloadToBufferFn).not.toHaveBeenCalled()
      expect(blobServiceClient.getContainerClient).toHaveBeenCalledWith('containerName')
    })

    test('should download file if exists and to buffer', async () => {
      const res = await downloadBlob('containerName', 'filename', true)
      expect(res).not.toBe(null)
      expect(downloadFn).not.toHaveBeenCalled()
      expect(downloadToBufferFn).toHaveBeenCalled()
      expect(blobServiceClient.getContainerClient).toHaveBeenCalledWith('containerName')
    })
  })
})
