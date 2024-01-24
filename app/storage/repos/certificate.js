const { blobServiceClient } = require('../get-blob-client')
const { blobConfig } = require('../../config')

const downloadCertificate = async (indexNumber, certificateId) => {
  const filename = `${indexNumber}/${certificateId}.pdf`

  console.log('downloadCertificate filename', filename)

  const containerClient = blobServiceClient.getContainerClient(blobConfig.certificateContainer)
  const blobClient = containerClient.getBlobClient(filename)

  let exists
  let attempts = 0

  do {
    exists = await blobClient.exists()

    if (!exists) {
      console.log('downloadCertificate waiting ', attempts)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    attempts++
  } while (!exists && attempts < 20)

  if (!exists) {
    console.log('downloadCertificate not exists after 20 tries')

    const error = new Error(`Certificate '${filename}' does not exist`)

    error.type = 'CertificateNotFound'

    throw error
  }

  console.log('downloadCertificate about to downloadToBuffer')

  return blobClient.downloadToBuffer()
}

module.exports = {
  downloadCertificate
}
