const { routes, views, keys, auditQueryTypes } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const { getFromSession } = require('../../../session/session-wrapper')
const ViewModel = require('../../../models/admin/audit/audit-query-details')
const { validatePayload } = require('../../../schema/portal/admin/audit/audit-query-details')
const { addDateComponents } = require('../../../lib/date-helpers')

module.exports = [
  {
    method: 'GET',
    path: routes.auditQueryDetails.get,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const details = getFromSession(request, keys.auditQuery)

        if (details[keys.fromDate]) {
          addDateComponents(details, keys.fromDate)
        }
        if (details[keys.toDate]) {
          addDateComponents(details, keys.toDate)
        }

        const queryType = details?.queryType
        const queryTypeText = auditQueryTypes.find(x => x.value === queryType)
        return h.view(views.auditQueryDetails, new ViewModel({ queryType, queryTypeText: queryTypeText?.text }))
      }
    }
  },
  {
    method: 'POST',
    path: routes.auditQueryDetails.post,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          console.log('POST audit-query-details validation error', error)
          const details = getFromSession(request, keys.auditQuery)
          const payload = { ...details, ...request.payload }
          return h.view(views.auditQueryDetails, new ViewModel(payload, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        console.log('JB here1')
        return h.redirect(routes.auditQueryDetails.get)
      }
    }
  }
]
