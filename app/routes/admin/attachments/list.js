const Joi = require('joi')
const { attachmentsContainer } = require('../../../config/storage/blob')
const { routes, views, keys } = require('../../../constants/admin')
const ViewModel = require('../../../models/admin/attachments/list')
const { admin } = require('../../../auth/permissions')
const { listFiles, deleteFile, renameFile } = require('../../../storage/repos/blob')
const { stripTimestampFromExtension } = require('../../../lib/format-helpers')
const { setInSession } = require('../../../session/session-wrapper')

module.exports = [{
  method: 'GET',
  path: routes.listAttachments.get,
  options: {
    auth: { scope: [admin] },
    plugins: {
      crumb: false
    },
    handler: async (request, h) => {
      setInSession(request, keys.attachmentFile, null)
      const files = await listFiles(attachmentsContainer)
      return h.view(views.listAttachments, new ViewModel(files))
    }
  }
},
{
  method: 'POST',
  path: routes.listAttachments.post,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const { test, remove, golive, revoke } = request.payload
      if (remove) {
        await deleteFile(attachmentsContainer, request.payload.remove)
        return h.redirect(routes.listAttachments.get)
      }

      if (test) {
        setInSession(request, keys.attachmentFile, test)
        return h.redirect(routes.testAttachment.get)
      }

      if (revoke) {
        await renameFile(attachmentsContainer, revoke, `${revoke}-${new Date().toISOString()}`)
        return h.redirect(routes.listAttachments.get)
      }

      if (golive) {
        const liveFilename = stripTimestampFromExtension(golive, '.pdf')
        const files = await listFiles(attachmentsContainer)
        if (files.includes(liveFilename)) {
          const errorMessage = `A file with name '${liveFilename}' is already live`
          const error = new Joi.ValidationError(errorMessage, [{ message: errorMessage, path: ['custom'], type: 'custom' }])
          return h.view(views.listAttachments, new ViewModel(files, error)).code(400).takeover()
        }

        await renameFile(attachmentsContainer, golive, stripTimestampFromExtension(golive, '.pdf'))
        return h.redirect(routes.listAttachments.get)
      }

      return h.redirect(routes.listAttachments.get)
    }
  }
}]
