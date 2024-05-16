const { downloadBlob } = require('./download-blob')

const downloadBlobAsStream = async (filename, writableStream) => {
  const downloadResponse = await downloadBlob(filename)

  downloadResponse.readableStreamBody.pipe(writableStream)
}

module.exports = {
  downloadBlobAsStream
}
