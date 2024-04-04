const { routes, views } = require('../../constants/admin')
const { admin } = require('../../auth/permissions')
const ViewModel = require('../../models/admin/process-comments')
const { getProcessComments } = require('../../api/ddi-index-api/process-comments')

module.exports = [
  {
    method: 'GET',
    path: `${routes.processComments.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const maxRecordsParams = request.query?.maxRecords
        const maxRecords = maxRecordsParams && parseInt(maxRecordsParams)
        const commentsResult = await getProcessComments(maxRecords)

        return h.view(views.processComments, new ViewModel(commentsResult))
      }
    }
  }
]
