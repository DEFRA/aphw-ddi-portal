const { routes, views } = require('../../../constants/cdo/dog')
const { sources: activitySources } = require('../../../constants/cdo/activity')
const { anyLoggedInUser } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/check-activities')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { getDogOwner } = require('../../../api/ddi-index-api/dog')
const { getPersonByReference } = require('../../../api/ddi-index-api/person')
const { getEvents } = require('../../../api/ddi-events-api/event')
const { getMainReturnPoint } = require('../../../lib/back-helpers')
const { sortEventsDesc, filterEvents } = require('../../../models/sorting/event')
const { getUser } = require('../../../auth')

/**
 * @param pk
 * @param source
 * @param user
 * @return {Promise<{firstName: string, lastName: string, birthDate: string, personReference: string, address: Address, contacts: Contacts}|*|null>}
 */
const getSourceEntity = async (pk, source, user) => {
  if (source === activitySources.dog) {
    return await getCdo(pk, user)
  } else if (source === activitySources.owner) {
    return await getPersonByReference(pk, user)
  }

  return null
}

/**
 * @param pk
 * @param source
 * @param user
 * @return {Promise<(*)[]|*[]>}
 */
const getEventPkList = async (pk, source, user) => {
  if (source === activitySources.dog) {
    const { personReference } = await getDogOwner(pk, user)
    return [pk, personReference]
  }
  return [pk]
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.viewActivities.get}/{pk}/{source}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const user = getUser(request)
        const pk = request.params.pk
        const source = request.params.source

        const entity = await getSourceEntity(pk, source, user)
        if (entity === null || entity === undefined) {
          return h.response().code(404).takeover()
        }

        const eventPkList = await getEventPkList(pk, source, user)

        const allEvents = await getEvents(eventPkList, user)

        const sourceEntity = {
          pk,
          source: request.params.source,
          title: source === activitySources.dog ? `Dog ${pk}` : `${entity.firstName} ${entity.lastName}`
        }

        const filteredEvents = filterEvents(allEvents, sourceEntity)

        const sortedActivities = sortEventsDesc(filteredEvents)

        const backNav = {
          backLink: getMainReturnPoint(request)
        }

        return h.view(views.viewDogActivities, new ViewModel(sourceEntity, sortedActivities, backNav))
      }
    }
  }
]
