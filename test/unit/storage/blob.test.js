const { blobServiceClient } = require('../../../app/storage/get-blob-client')
jest.mock('../../../app/storage/get-blob-client')

const uploadStreamFn = jest.fn()
const deleteFn = jest.fn()
const downloadFn = jest.fn()

const getMockAsyncIterator = () => {
  return (async function * () {
    yield { segment: { blobItems: [{ name: 'file1' }, { name: 'file2' }] } }
    yield { segment: { blobItems: [{ name: 'file3' }, { name: 'file4' }, { name: 'file5' }] } }
  })()
}

blobServiceClient.getContainerClient.mockReturnValue({
  createIfNotExists: jest.fn(),
  getBlockBlobClient: jest.fn().mockResolvedValue({
    uploadStream: uploadStreamFn,
    delete: deleteFn,
    downloadToBuffer: downloadFn
  }),
  listBlobsFlat: jest.fn().mockReturnValue({
    byPage: getMockAsyncIterator
  })
})

const { uploadFile, deleteFile, renameFile, listFiles } = require('../../../app/storage/repos/blob')

describe('storage blob', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('uploadFile', () => {
    test('should upload file', async () => {
      const res = await uploadFile()
      expect(res).not.toBe(null)
      expect(uploadStreamFn).toHaveBeenCalled()
    })
  })

  describe('renameFile', () => {
    test('should rename file', async () => {
      await renameFile()
      expect(uploadStreamFn).toHaveBeenCalled()
      expect(downloadFn).toHaveBeenCalled()
      expect(deleteFn).toHaveBeenCalledWith({ deleteSnapshots: 'include' })
    })
  })

  describe('deleteFile', () => {
    test('should delete file', async () => {
      const res = await deleteFile()
      expect(res).not.toBe(null)
      expect(deleteFn).toHaveBeenCalledWith({ deleteSnapshots: 'include' })
    })
  })

  describe('listFiles', () => {
    test('should list file', async () => {
      const res = await listFiles()
      expect(res).toEqual(['file1', 'file2', 'file3', 'file4', 'file5'])
    })
  })
})
