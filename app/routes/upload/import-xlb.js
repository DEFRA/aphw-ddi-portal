const { blobConfig } = require('../../config')
const { Readable } = require('stream')
const { routes, views, keys, stages } = require('../../constants/upload')
const { uploadRegisterFile } = require('../../storage/repos/register-blob')
const Joi = require('joi')
const ViewModel = require('../../models/upload/register')
const { admin } = require('../../auth/permissions')
const { getUser } = require('../../auth')
const { doImport } = require('../../api/ddi-index-api/import')
const { setInSession } = require('../../session/session-wrapper')

module.exports = [{
  method: 'GET',
  path: routes.importXlb.get,
  options: {
    auth: { scope: [admin] },
    plugins: {
      crumb: false
    },
    handler: async (request, h) => {
      return h.view(views.importXlb, new ViewModel())
    }
  }
},
{
  method: 'POST',
  path: routes.importXlb.post,
  options: {
    auth: { scope: [admin] },
    plugins: {
      crumb: false
    },
    payload: {
      maxBytes: (50 * 1024 * 1024) + 250,
      multipart: true,
      timeout: false,
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    },
    validate: {
      payload: Joi.object({
        register: Joi.object({
          hapi: Joi.object({
            filename: Joi.string().regex(/^(.+)\.(xls|xlsx)$/).message('Incorrect register file type. Must be .xls or .xlsx.')
          }).required().unknown(true)
        }).required().unknown(true).messages({
          '*': 'Select a file'
        })
      }).required().unknown(true),
      failAction: (request, h, err) => {
        return h.view(views.importXlb, new ViewModel(err)).takeover(400)
      }
    },
    handler: async (request, h) => {
      const filename = `ddi-upload-${new Date().toISOString()}`
      const fileBuffer = request.payload.register._data

      const stream = new Readable()
      stream.push(fileBuffer)
      stream.push(null)

      await uploadRegisterFile(blobConfig.registerContainer, filename, stream)

      const res = await doImport(filename, stages.spreadsheetValidation, getUser(request))

      setInSession(request, keys.importValidationResults, res)
      setInSession(request, keys.importFilename, filename)

      return h.redirect(routes.importValidation.get)
    }
  }
}]
