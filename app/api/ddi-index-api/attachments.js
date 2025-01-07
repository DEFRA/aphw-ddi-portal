const { post } = require('./base')

const attachmentsEndpoint = 'attachments'

/**
 * @typedef CourtRequest
 * @property {string} name
 */

/**
 * @param {CourtRequest} court
 * @param user
 * @return {Promise<CourtRequest>}
 */
const testAttachmentFile = async (fileInfo, fieldData, user) => {
  const payload = await post(`${attachmentsEndpoint}/test`, { fileInfo, fieldData }, user)
  return payload
}

module.exports = {
  testAttachmentFile
}
