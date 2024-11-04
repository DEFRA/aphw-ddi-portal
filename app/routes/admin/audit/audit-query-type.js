const { routes, views, keys } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/admin/audit/audit-query-type')
const { validatePayload } = require('../../../schema/portal/admin/audit/audit-query-type')
const { setInSession, getFromSession } = require('../../../session/session-wrapper')

module.exports = [
  {
    method: 'GET',
    path: `${routes.auditQueryType.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        if (request.query.clear === 'true') {
          setInSession(request, keys.auditQuery)
          return h.redirect(routes.auditQueryType.get)
        }

        const details = getFromSession(request, keys.auditQuery)
        return h.view(views.auditQueryType, new ViewModel(details))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.auditQueryType.post}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const details = getFromSession(request, keys.auditQuery)
          return h.view(views.auditQueryType, new ViewModel(details, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const details = getFromSession(request, keys.auditQuery)
        setInSession(request, keys.auditQuery, { ...details, queryType: request.payload.queryType })
        return h.redirect(routes.auditQueryDetails.get)
      }
    }
  }
]
