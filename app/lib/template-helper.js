const { v4: uuidv4 } = require('uuid')
const config = require('../config/storage/blob')
const { testAttachmentFile } = require('../api/ddi-index-api/attachments')
const { downloadBlob } = require('../storage/repos/download-blob')
const { deleteFile } = require('../storage/repos/blob')
const attachmentsContainer = config.attachmentsContainer

const testTemplateFile = async (sourceFilename, fieldData, user) => {
  const fileInfo = {
    filename: sourceFilename,
    fileGuid: uuidv4(),
    saveFile: true
  }
  const results = await testAttachmentFile(fileInfo, fieldData, user)
  const tempFilename = `temp-populations/${fileInfo.fileGuid}.pdf`

  if (results.status !== 'ok') {
    throw new Error(`Error during template test: ${results.message}`)
  }

  const pdfFile = await downloadBlob(attachmentsContainer, tempFilename, true)

  await deleteFile(attachmentsContainer, tempFilename)

  return pdfFile
}

module.exports = {
  testTemplateFile
}
