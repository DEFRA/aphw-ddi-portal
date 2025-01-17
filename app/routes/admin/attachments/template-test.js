const { routes, views, keys } = require('../../../constants/admin')
const ViewModel = require('../../../models/admin/attachments/testing')
const { admin } = require('../../../auth/permissions')
const { getFromSession, setInSession } = require('../../../session/session-wrapper')
const { getUser } = require('../../../auth')
const { testTemplateFile } = require('../../../lib/template-helper')
const { formatToGds } = require('../../../lib/date-helpers')

const defaultFieldValues = {
  ddi_index_number: 'ED123456',
  ddi_dog_name: 'Rex',
  ddi_owner_name: 'John Johnson',
  ddi_address_line_1: '123 Testing Street',
  ddi_address_line_2: 'Testarea',
  ddi_town: 'Testington',
  ddi_postcode: 'TS1 4ST',
  ddi_todays_date: formatToGds(new Date())
}

module.exports = [{
  method: 'GET',
  path: routes.testAttachment.get,
  options: {
    auth: { scope: [admin] },
    plugins: {
      crumb: false
    },
    handler: async (request, h) => {
      if (request.query.default) {
        setInSession(request, keys.attachmentTestData, defaultFieldValues)
        return h.redirect(routes.testAttachment.get)
      }

      const data = getFromSession(request, keys.attachmentTestData) || defaultFieldValues
      return h.view(views.testAttachment, new ViewModel(data))
    }
  }
},
{
  method: 'POST',
  path: routes.testAttachment.post,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const sourceFilename = getFromSession(request, keys.attachmentFile)
      setInSession(request, keys.attachmentTestData, request.payload)
      const outputFileContents = await testTemplateFile(sourceFilename, request.payload, getUser(request))

      return h.response(outputFileContents).type('application/pdf').header('Content-Disposition', 'filename="template-test-result.pdf"')
    }
  }
}]
