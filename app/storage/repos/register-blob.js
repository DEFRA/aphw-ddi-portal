const { blobServiceClient } = require('../get-blob-client')

const uploadRegisterFile = async (containerName, filename, stream) => {
  const container = blobServiceClient.getContainerClient(containerName)

  await container.createIfNotExists()

  const blob = await container.getBlockBlobClient(filename)

  await blob.uploadStream(stream)

  return blob
}

module.exports = {
  uploadRegisterFile
}
