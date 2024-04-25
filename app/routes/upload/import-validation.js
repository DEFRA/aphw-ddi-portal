const { routes, views, keys, stages } = require('../../constants/upload')
const ViewModel = require('../../models/upload/importValidation')
const { admin } = require('../../auth/permissions')
const { getUser } = require('../../auth')
const { doImport } = require('../../api/ddi-index-api/import')
const { setInSession, getFromSession } = require('../../session/session-wrapper')

module.exports = [{
  method: 'GET',
  path: routes.importValidation.get,
  options: {
    auth: { scope: [admin] },
    plugins: {
      crumb: false
    },
    handler: async (request, h) => {
      const res = getFromSession(request, keys.importValidationResults)
      return h.view(views.importValidation, new ViewModel(res))
    }
  }
},
{
  method: 'POST',
  path: routes.importValidation.post,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const filename = getFromSession(request, keys.importFilename)

      if (!filename) {
        throw new Error('Missing filename for import')
      }

      const res = await doImport(filename, stages.importValidation, getUser(request))

      setInSession(request, keys.importLog, res)

      return h.redirect(`${routes.importResults.get}`)
    }
  }
}]
