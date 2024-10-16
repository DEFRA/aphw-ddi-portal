const { routes } = require('../../constants/admin')
const { admin } = require('../../auth/permissions')
const { getExternalEvents } = require('../../api/ddi-events-api/external-event')

module.exports = [
  {
    method: 'GET',
    path: `${routes.externalEvents.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const { queryType, pks, fromDate, toDate } = request.query

        let queryString = `?queryType=${queryType}`
        if (pks) {
          queryString += `&pks=${pks}`
        }
        if (fromDate) {
          queryString += `&fromDate=${fromDate}`
        }
        if (toDate) {
          queryString += `&toDate=${toDate}`
        }
        const events = await getExternalEvents(queryString)

        return h.response(events)
      }
    }
  }
]
