const { blobServiceClient } = require('../get-blob-client')
const storageConfig = require('../../config/storage/blob')

const downloadCertificate = async (indexNumber, certificateId) => {
  const filename = `${indexNumber}/${certificateId}.pdf`

  const containerClient = blobServiceClient.getContainerClient(storageConfig.certificateContainer)
  const blobClient = containerClient.getBlobClient(filename)

  const exists = await blobClient.exists()

  if (!exists) {
    throw new Error(`Certificate '${filename}' does not exist`)
  }

  return blobClient.downloadToBuffer()
}

module.exports = {
  downloadCertificate
}
