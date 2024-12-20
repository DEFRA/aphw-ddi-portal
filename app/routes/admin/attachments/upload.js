const { blobConfig } = require('../../../config')
const { Readable } = require('stream')
const { routes, views } = require('../../../constants/admin')
const { uploadFile } = require('../../../storage/repos/blob')
const Joi = require('joi')
const ViewModel = require('../../../models/admin/attachments/upload')
const { admin } = require('../../../auth/permissions')

module.exports = [{
  method: 'GET',
  path: routes.uploadAttachments.get,
  options: {
    auth: { scope: [admin] },
    plugins: {
      crumb: false
    },
    handler: async (_request, h) => {
      return h.view(views.uploadAttachments, new ViewModel())
    }
  }
},
{
  method: 'POST',
  path: routes.uploadAttachments.post,
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
        upload: Joi.object({
          hapi: Joi.object({
            filename: Joi.string().regex(/^(.+)\.(pdf)$/).message('Incorrect file type. Must be .pdf')
          }).required().unknown(true)
        }).required().unknown(true).messages({
          '*': 'Select a file'
        })
      }).required().unknown(true),
      failAction: (request, h, err) => {
        return h.view(views.uploadAttachments, new ViewModel(err)).takeover(400)
      }
    },
    handler: async (request, h) => {
      const filename = `${request.payload.upload.hapi.filename}-${new Date().toISOString()}`
      const fileBuffer = request.payload.upload._data

      const stream = new Readable()
      stream.push(fileBuffer)
      stream.push(null)

      await uploadFile(blobConfig.attachmentsContainer, filename, stream)

      return h.redirect(routes.listAttachments.get)
    }
  }
}]
