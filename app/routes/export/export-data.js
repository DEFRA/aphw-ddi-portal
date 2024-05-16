const { PassThrough } = require('stream')
const exportConstants = require('../../constants/export')
const { admin } = require('../../auth/permissions')
const getUser = require('../../auth/get-user')
const { createExportFile, exportAudit } = require('../../api/ddi-index-api/export')
const { stripTimeFromUTC, formatToDateTime } = require('../../lib/date-helpers')
const { downloadBlobAsStream } = require('../../storage/repos/download-blob-stream')

module.exports = [{
  method: 'GET',
  path: exportConstants.routes.export.get,
  options: {
    auth: { scope: [admin] },
    plugins: {
      crumb: false
    },
    handler: async (request, h) => {
      return h.view(exportConstants.views.export)
    }
  }
},
{
  method: 'GET',
  path: exportConstants.routes.exportCreateFile.get,
  options: {
    auth: { scope: [admin] },
    plugins: {
      crumb: false
    },
    handler: async (request, h) => {
      // Deliberately excluding 'await' to trigger back-end process but prevent UI timeout
      const batchSize = request.query.batchSize ?? 0
      createExportFile(batchSize)

      return h.response(`Triggered export file creation at ${formatToDateTime(new Date())} with batchSize ${batchSize}`)
    }
  }
},
{
  method: 'POST',
  path: exportConstants.routes.export.post,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const now = stripTimeFromUTC(new Date())
      const stream = new PassThrough()
      const requestingUser = getUser(request)

      stream.on('finish', () => {
        exportAudit(requestingUser)
      })

      await downloadBlobAsStream('daily_export.csv', stream)

      return h.response(stream)
        .header('Content-Type', 'application/octet-stream')
        .header('Content-Disposition', `attachment; filename= dogs-full-${now}.csv`)
    }
  }
}]
