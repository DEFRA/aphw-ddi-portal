const { blobServiceClient } = require('../get-blob-client')
const { blobConfig } = require('../../config')

const downloadBlob = async (filename) => {
  const container = blobServiceClient.getContainerClient(blobConfig.registerContainer)

  const blobClient = await container.getBlockBlobClient(filename)

  const exists = await blobClient.exists()

  if (!exists) {
    console.log(`Read export file: File ${filename} does not exist`)
    throw new Error(`File ${filename} does not exist`)
  }

  return await blobClient.download()
}

module.exports = {
  downloadBlob
}
