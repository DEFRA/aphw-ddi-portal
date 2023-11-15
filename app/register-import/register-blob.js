const { blobServiceClient } = require('../storage/blob')
const { blobConfig } = require('../config')

const container = blobServiceClient.getContainerClient(blobConfig.registerContainer)

console.info(`Creating blob container (${blobConfig.registerContainer})`)
container.createIfNotExists()

const uploadRegisterFile = async (filename, stream) => {
  const blob = await container.getBlockBlobClient(filename)

  await blob.uploadStream(stream)

  return blob
}

module.exports = {
  uploadRegisterFile
}
