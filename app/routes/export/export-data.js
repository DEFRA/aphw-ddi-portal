const { format } = require('date-fns')
const exportConstants = require('../../constants/export')
const { admin } = require('../../auth/permissions')
const getUser = require('../../auth/get-user')
const { exportData } = require('../../api/ddi-index-api/export')

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
  method: 'POST',
  path: exportConstants.routes.export.post,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const now = format(new Date(), 'yyyy-MM-dd')
      const exported = await exportData(getUser(request))
      return h.response(exported)
        .header('Content-Type', 'application/octet-stream')
        .header('Content-Disposition', `attachment; filename= dogs-full-${now}.csv`)
    }
  }
}]
