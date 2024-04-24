const Joi = require('joi')
const { routes, views, keys, stages } = require('../../constants/upload')
const ViewModel = require('../../models/upload/importResults')
const { admin } = require('../../auth/permissions')
const { getFromSession, setInSession } = require('../../session/session-wrapper')
const { doImport } = require('../../api/ddi-index-api/import')
const { getUser } = require('../../auth')

module.exports = [{
  method: 'GET',
  path: routes.importResults.get,
  options: {
    auth: { scope: [admin] },
    plugins: {
      crumb: false
    },
    handler: async (request, h) => {
      const res = getFromSession(request, keys.importLog)
      return h.view(views.importResults, new ViewModel(res))
    }
  }
},
{
  method: 'POST',
  path: routes.importResults.post,
  options: {
    auth: { scope: [admin] },
    validate: {
      payload: Joi.object({
        confirm: Joi.string().required().messages({
          '*': 'Check the box to confirm'
        })
      }).required(),
      failAction: (request, h, err) => {
        const res = getFromSession(request, keys.importLog)

        return h.view(views.importResults, new ViewModel(res, err)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const filename = getFromSession(request, keys.importFilename)

      if (!filename) {
        throw new Error('Missing filename for import')
      }

      const res = await doImport(filename, stages.saveToDb, getUser(request))

      setInSession(request, keys.finalImportLog, res)

      return h.redirect(`${routes.importCompleted.get}`)
    }
  }
}]
