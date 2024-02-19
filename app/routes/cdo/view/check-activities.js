const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/check-activities')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { getDogOwner } = require('../../../api/ddi-index-api/dog')
const { getEvents } = require('../../../api/ddi-events-api/event')
const { getMainReturnPoint } = require('../../../lib/back-helpers')
const { sortEventsDesc } = require('../../../models/sorting/event')

const getSourceEntity = async (pk, source) => {
  return source === 'dog'
    ? await getCdo(pk)
    : null
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.viewActivities.get}/{pk}/{source}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const pk = request.params.pk
        const cdo = await getSourceEntity(pk, request.params.source)
        const { personReference } = await getDogOwner(pk)
        const allEvents = await getEvents([pk, personReference])

        if (cdo === null || cdo === undefined) {
          return h.response().code(404).takeover()
        }

        const sourceEntity = {
          pk,
          source: request.params.source
        }

        const filtedActivities = allEvents.events.filter(event => event.type === 'uk.gov.defra.ddi.event.activity')
        const sortedActivities = sortEventsDesc(filtedActivities)

        const backNav = {
          backLink: getMainReturnPoint(request)
        }

        return h.view(views.viewDogActivities, new ViewModel(sourceEntity, sortedActivities, backNav))
      }
    }
  }
]
