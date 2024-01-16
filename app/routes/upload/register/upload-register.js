const { Readable } = require('stream')
const uploadConstants = require('../../../constants/upload')
const { uploadRegisterFile } = require('../../../storage/repos/register-blob')
const { setUploaded } = require('../../../storage/repos/register-status')
const Joi = require('joi')
const ViewModel = require('../../../models/upload/register')
const { sendMessage } = require('../../../messaging/outbound')
const { admin } = require('../../../auth/permissions')
const { getUser } = require('../../../auth')

module.exports = [{
  method: 'GET',
  path: uploadConstants.routes.register.get,
  options: {
    auth: { scope: [admin] },
    plugins: {
      crumb: false
    },
    handler: async (request, h) => {
      return h.view(uploadConstants.views.register, new ViewModel())
    }
  }
},
{
  method: 'POST',
  path: uploadConstants.routes.register.post,
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
        }).required().unknown(true)
      }).required().unknown(true),
      failAction: (request, h, err) => {
        return h.view(uploadConstants.views.register, new ViewModel(err)).takeover(400)
      }
    },
    handler: async (request, h) => {
      const filename = `ddi-register-${new Date().toISOString()}`
      const fileBuffer = request.payload.register._data

      const stream = new Readable()
      stream.push(fileBuffer)
      stream.push(null)

      const email = getUser(request).username

      await uploadRegisterFile(filename, stream)

      await setUploaded(filename, email)

      await sendMessage({ filename, email })

      return h.redirect(uploadConstants.routes.register.get)
    }
  }
}]
