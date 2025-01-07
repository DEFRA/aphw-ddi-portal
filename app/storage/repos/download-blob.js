const { blobServiceClient } = require('../get-blob-client')

const downloadBlob = async (containerName, filename, toBuffer = false) => {
  const container = blobServiceClient.getContainerClient(containerName)

  const blobClient = await container.getBlockBlobClient(filename)

  const exists = await blobClient.exists()

  if (!exists) {
    console.log(`Read export file: File ${filename} does not exist`)
    throw new Error(`File ${filename} does not exist`)
  }

  return toBuffer ? await blobClient.downloadToBuffer() : await blobClient.download()
}

module.exports = {
  downloadBlob
}
