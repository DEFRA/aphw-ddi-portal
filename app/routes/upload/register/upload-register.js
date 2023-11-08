const { Readable } = require('stream')
const uploadConstants = require('../../../constants/upload')
const { uploadDataFile } = require('../../../storage')
const Joi = require('joi')
const ViewModel = require('../../../models/upload/register')

module.exports = [{
  method: 'GET',
  path: uploadConstants.routes.register.get,
  options: {
    plugins: {
      crumb: false
    },
    handler: async (request, h) => {
      return h.view(uploadConstants.views.register)
    }
  }
},
{
  method: 'POST',
  path: uploadConstants.routes.register.post,
  options: {
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
        }).required().unknown(true)
      }).required().unknown(true),
      failAction: (request, h, err) => {
        return h.view(uploadConstants.views.register, new ViewModel(err)).takeover(400)
      }
    },
    handler: async (request, h) => {
      const filename = `dd-register-${new Date().toISOString()}`
      const fileBuffer = request.payload.register._data

      const stream = new Readable()
      stream.push(fileBuffer)
      stream.push(null)

      await uploadDataFile(stream, filename)

      return h.redirect(uploadConstants.routes.register.get)
    }
  }
}]
