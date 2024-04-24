const { routes, views, keys } = require('../../constants/upload')
const ViewModel = require('../../models/upload/importValidation')
const { admin } = require('../../auth/permissions')
const { getFromSession } = require('../../session/session-wrapper')

module.exports = [{
  method: 'GET',
  path: routes.importCompleted.get,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const res = getFromSession(request, keys.finalImportLog)

      return h.view(views.importCompleted, new ViewModel(res))
    }
  }
}]
