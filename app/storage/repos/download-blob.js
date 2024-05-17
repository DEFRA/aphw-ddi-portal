const { blobServiceClient } = require('../get-blob-client')

const downloadBlob = async (containerName, filename) => {
  const container = blobServiceClient.getContainerClient(containerName)

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
