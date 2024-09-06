const { get } = require('./base')

const exportAuditEndpoint = 'export-audit'
const createExportFileEndpoint = 'export-create-file'

const exportAudit = async (user) => {
  await get(exportAuditEndpoint, user)
}

const createExportFile = async (batchSize, user) => {
  await get(`${createExportFileEndpoint}?batchSize=${batchSize}`, user)
}

module.exports = {
  exportAudit,
  createExportFile
}
