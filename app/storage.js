const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('./config').storageConfig
let blobServiceClient
let containersInitialised
let foldersInitialised

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
  foldersInitialised ?? await initialiseFolders()
  containersInitialised = true
}

const initialiseFolders = async () => {
  console.log('Making sure folders exist')
  const placeHolderText = 'Placeholder'
  const dataClient = container.getBlockBlobClient(`${config.dataFolder}/default.txt`)
  await dataClient.upload(placeHolderText, placeHolderText.length)
  foldersInitialised = true
  console.log('Folders ready')
}

const getBlob = async (folder, filename) => {
  containersInitialised ?? await initialiseContainers()
  return container.getBlockBlobClient(`${folder}/${filename}`)
}

const getDataFileList = async () => {
  containersInitialised ?? await initialiseContainers()

  const fileList = []
  for await (const file of container.listBlobsFlat({ prefix: config.dataFolder })) {
    if (file.name.endsWith('.dat') || file.name.endsWith('.gne') || file.name.endsWith('.INT')) {
      fileList.push(file.name.replace(`${config.dataFolder}/`, ''))
    }
  }

  return fileList
}

const getDataFileDetails = async (filename) => {
  const blob = await getBlob(config.dataFolder, filename)
  return blob.getProperties()
}

const uploadDataFile = async (stream, filename) => {
  containersInitialised ?? await initialiseContainers()
  const blockBlobClient = await getBlob(config.dataFolder, filename)
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
  getDataFileList,
  getDataFileDetails,
  blobServiceClient,
  uploadDataFile,
  downloadDataFile
}
