const { routes, views, keys } = require('../../../constants/cdo/owner')
const { anyLoggedInUser } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/police-force-not-found')
const { getMainReturnPoint } = require('../../../lib/back-helpers')
const { setInSession } = require('../../../session/session-wrapper')
const { setPostcodeLookupDetails } = require('../../../session/cdo/owner')
const { getPersonAndDogs } = require('../../../api/ddi-index-api/person')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const getUser = require('../../../auth/get-user')

module.exports = [
  {
    method: 'GET',
    path: `${routes.policeForceNotFound.get}/{personReference}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const user = getUser(request)

        const personReference = request.params.personReference

        const personAndDogs = await getPersonAndDogs(personReference, user)

        if (personAndDogs == null) {
          return h.response().code(404).takeover()
        }

        console.log('JB personAndDOgs', personAndDogs)
        const firstCdo = await getCdo(personAndDogs.dogs[0].indexNumber, user)
        console.log('JB firstCdo', firstCdo)

        const breadcrumbLink = getMainReturnPoint(request)

        return h.view(views.policeForceNotFound, new ViewModel(personAndDogs, firstCdo, breadcrumbLink))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.policeForceNotFound.post}/{personReference?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        setInSession(request, keys.policeForceChangedResult, null)
        setPostcodeLookupDetails(request, null)
        setInSession(request, 'addresses', null)
        return h.redirect(getMainReturnPoint(request))
      }
    }
  }
]
