const { get } = require('./base')

const jobsEndpoint = 'process-comments'

const options = {
  json: true
}

/**
 * @param {number} [maxRecordsParam]
 * @returns {Promise<{
 *    "rowsProcessed": number,
 *    "rowsInError": number,
 *    "rowsPublishedToEvents": number
 * }>}
 */
const getProcessComments = async (maxRecordsParam) => {
  const maxRecords = maxRecordsParam || 50
  const payload = await get(`${jobsEndpoint}?maxRecords=${maxRecords}`, options)

  return payload
}

module.exports = {
  getProcessComments
}
