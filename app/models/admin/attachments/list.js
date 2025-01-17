/**
 * @param {Attachment[]} attachments
 * @param [validationError]
 * @constructor
 */
function ViewModel (sendPackFiles, postPackFiles, validationError) {
  this.model = {
    backLink: '/admin/index',
    sendPackTemplates: sendPackFiles.map(att => ({
      filename: att,
      isLive: !att.toLowerCase().endsWith('.draft.pdf')
    })),
    postPackTemplates: postPackFiles.map(att => ({
      filename: att,
      isLive: !att.toLowerCase().endsWith('.draft.pdf')
    })),
    errors: []
  }

  if (validationError) {
    for (const error of validationError.details) {
      this.model.errors.push({ text: error.message, href: '#' })
    }
  }
}

module.exports = ViewModel
