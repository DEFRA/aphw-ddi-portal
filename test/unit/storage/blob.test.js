const { Readable } = require('stream')

const { blobServiceClient } = require('../../../app/storage/get-blob-client')
jest.mock('../../../app/storage/get-blob-client')

const uploadStreamFn = jest.fn()
const deleteFn = jest.fn()
const downloadFn = jest.fn().mockResolvedValue('12345678-pdf-content')

const getMockAsyncIterator = () => {
  return (async function * () {
    yield { name: 'folder/file1' }
    yield { name: 'folder/file2' }
    yield { name: 'fileBad' }
    yield { name: 'folder/file3' }
    yield { name: 'folder/file4' }
    yield { name: '/tempfile5' }
    yield { name: 'folder/file6' }
  })()
}

blobServiceClient.getContainerClient.mockReturnValue({
  createIfNotExists: jest.fn(),
  getBlockBlobClient: jest.fn().mockResolvedValue({
    uploadStream: uploadStreamFn,
    delete: deleteFn,
    downloadToBuffer: downloadFn
  }),
  listBlobsByHierarchy: getMockAsyncIterator
})

const { uploadFile, deleteFile, renameFile, listFiles } = require('../../../app/storage/repos/blob')

describe('storage blob', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('uploadFile', () => {
    test('should upload file', async () => {
      const res = await uploadFile('containerName', 'filename', 'stream1')
      expect(res).not.toBe(null)
      expect(uploadStreamFn).toHaveBeenCalledWith('stream1')
    })
  })

  describe('renameFile', () => {
    test('should rename file', async () => {
      const stream = new Readable()
      stream.push('12345678-pdf-content')
      stream.push(null)
      await renameFile('containerName', 'oldFilename', 'newFilename')
      expect(uploadStreamFn).toHaveBeenCalledWith(stream)
      expect(downloadFn).toHaveBeenCalled()
      expect(deleteFn).toHaveBeenCalledWith({ deleteSnapshots: 'include' })
    })
  })

  describe('deleteFile', () => {
    test('should delete file', async () => {
      const res = await deleteFile('containerName', 'fileName')
      expect(res).not.toBe(null)
      expect(deleteFn).toHaveBeenCalledWith({ deleteSnapshots: 'include' })
      expect(blobServiceClient.getContainerClient).toHaveBeenCalledWith('containerName')
    })
  })

  describe('listFiles', () => {
    test('should list file', async () => {
      const res = await listFiles('attachments', 'folder')
      expect(res).toEqual(['file1', 'file2', 'file3', 'file4', 'file6'])
    })
  })
})
