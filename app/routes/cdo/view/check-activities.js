const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/check-activities')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { getEvents } = require('../../../api/ddi-events-api/event')
const { addBackNavigation } = require('../../../lib/back-helpers')
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
        const cdo = await getSourceEntity(request.params.pk, request.params.source)
        const allEvents = await getEvents([request.params.pk])

        if (cdo === null || cdo === undefined) {
          return h.response().code(404).takeover()
        }

        const sourceEntity = {
          pk: request.params.pk,
          source: request.params.source
        }

        const filtedActivities = allEvents.events.filter(event => event.type === 'uk.gov.defra.ddi.event.activity')
        const sortedActivities = sortEventsDesc(filtedActivities)

        const backNav = addBackNavigation(request, true)

        return h.view(views.viewDogActivities, new ViewModel(sourceEntity, sortedActivities, backNav))
      }
    }
  }
]
