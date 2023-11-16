const { blobServiceClient } = require('./get-blob-client')
const { blobConfig } = require('../config')

const uploadRegisterFile = async (filename, stream) => {
  const container = blobServiceClient.getContainerClient(blobConfig.registerContainer)

  await container.createIfNotExists()

  const blob = await container.getBlockBlobClient(filename)

  await blob.uploadStream(stream)

  return blob
}

module.exports = {
  uploadRegisterFile
}
