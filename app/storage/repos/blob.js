const { Readable } = require('stream')
const { blobServiceClient } = require('../get-blob-client')

const uploadFile = async (containerName, filename, stream) => {
  const container = blobServiceClient.getContainerClient(containerName)

  await container.createIfNotExists()

  const blob = await container.getBlockBlobClient(filename)

  await blob.uploadStream(stream)

  return blob
}

const listFiles = async (containerName, folderName) => {
  const container = blobServiceClient.getContainerClient(containerName)

  await container.createIfNotExists()

  const files = []
  for await (const item of container.listBlobsByHierarchy('/', { prefix: `${folderName}/` })) {
    if (item.name.startsWith(`${folderName}/`)) {
      files.push(item.name.substr(folderName.length + 1))
    }
  }

  return files
}

const deleteFile = async (containerName, filename) => {
  const container = blobServiceClient.getContainerClient(containerName)

  const blob = await container.getBlockBlobClient(filename)

  await blob.delete({ deleteSnapshots: 'include' })
}

const renameFile = async (containerName, oldFilename, newFilename) => {
  const container = blobServiceClient.getContainerClient(containerName)

  const blob = await container.getBlockBlobClient(oldFilename)
  const fileContents = await blob.downloadToBuffer()
  const stream = new Readable()
  stream.push(fileContents)
  stream.push(null)
  await uploadFile(containerName, newFilename, stream)
  await blob.delete({ deleteSnapshots: 'include' })
}

module.exports = {
  uploadFile,
  listFiles,
  deleteFile,
  renameFile
}
