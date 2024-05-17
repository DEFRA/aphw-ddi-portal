const { downloadBlob } = require('./download-blob')

const downloadBlobAsStream = async (containerName, filename, writableStream) => {
  const downloadResponse = await downloadBlob(containerName, filename)

  downloadResponse.readableStreamBody.pipe(writableStream)
}

module.exports = {
  downloadBlobAsStream
}
