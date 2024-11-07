const { routes, views, keys } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const { getFromSession, setInSession } = require('../../../session/session-wrapper')
const ViewModel = require('../../../models/admin/audit/audit-query-details')
const { validatePayload } = require('../../../schema/portal/admin/audit/audit-query-details')
const { addDateComponents, getEndOfDayTime } = require('../../../lib/date-helpers')
const { getExternalEvents } = require('../../../api/ddi-events-api/external-event')
const { getUser } = require('../../../auth')

const runAuditQuery = async (request, payload) => {
  const { queryType, pk, fromDate, toDate } = payload
  let queryString = `?queryType=${queryType}`
  if (pk) {
    if (queryType === 'dog') {
      queryString += pk.startsWith('ED') ? `&pks=${pk}` : `&pks=ED${pk}`
    } else {
      queryString += `&pks=${pk}`
    }
  } else {
    queryString += '&pks=dummy'
  }
  if (fromDate) {
    queryString += `&fromDate=${fromDate.toISOString()}`
  }
  if (toDate) {
    const endOfDay = getEndOfDayTime(toDate)
    queryString += `&toDate=${endOfDay.toISOString()}`
  }
  const res = await getExternalEvents(queryString, getUser(request))
  return res?.results
}

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

        if (details[`${details.queryType}_pk`]) {
          details.pk = details[`${details.queryType}_pk`]
        } else {
          details.pk = undefined
        }

        return h.view(views.auditQueryDetails, new ViewModel(details))
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
        const details = getFromSession(request, keys.auditQuery)
        const payload = { ...details, ...request.payload }
        payload.results = await runAuditQuery(request, payload)
        payload[`${details.queryType}_pk`] = payload.pk
        setInSession(request, keys.auditQuery, payload)
        return h.redirect(routes.auditQueryDetails.get)
      }
    }
  }
]
