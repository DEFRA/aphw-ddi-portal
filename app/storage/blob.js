const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('../config').blobConfig
let blobServiceClient
let containersInitialised

const ONE_MEGABYTE = 1024 * 1024
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 }

if (config.useConnectionStr) {
  console.log('Using connection string for BlobServiceClient')
  blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
} else {
  console.log('Using DefaultAzureCredential for BlobServiceClient')
  const uri = `https://${config.storageAccount}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential())
}

const container = blobServiceClient.getContainerClient(config.container)

const initialiseContainers = async () => {
  if (config.createContainers) {
    console.log('Making sure blob containers exist')
    await container.createIfNotExists()
    console.log('Containers ready')
  }

  containersInitialised = true
}

const getBlob = async (filename) => {
  containersInitialised ?? await initialiseContainers()
  return container.getBlockBlobClient(filename)
}

const uploadDataFile = async (stream, filename) => {
  containersInitialised ?? await initialiseContainers()
  const blockBlobClient = await getBlob(filename)
  await blockBlobClient.uploadStream(stream,
    uploadOptions.bufferSize, uploadOptions.maxBuffers)

  return blockBlobClient
}

const downloadDataFile = async (filename) => {
  containersInitialised ?? await initialiseContainers()
  console.log(`Downloading blob ${filename} from container ${config.container}`)
  const blockBlobClient = await getBlob(config.dataFolder, filename)
  return blockBlobClient.downloadToBuffer()
}

module.exports = {
  blobServiceClient,
  uploadDataFile,
  downloadDataFile
}
