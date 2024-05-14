const { get } = require('./base')

const exportEndpoint = 'export'
const createExportFileEndpoint = 'export-create-file'

const exportData = async (user) => {
  const payload = await get(exportEndpoint, user)

  return payload.csv
}

const createExportFile = async (batchSize) => {
  await get(`${createExportFileEndpoint}?batchSize=${batchSize}`)
}

module.exports = {
  exportData,
  createExportFile
}
