const { routes, views } = require('../../../constants/cdo/owner')
const { anyLoggedInUser } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/owner-details')
const { getPersonAndDogs } = require('../../../api/ddi-index-api/person')
const { addBackNavigation } = require('../../../lib/back-helpers')
const { setActivityDetails } = require('../../../session/cdo/activity')
const { getUser } = require('../../../auth')

module.exports = [
  {
    method: 'GET',
    path: `${routes.viewOwnerDetails.get}/{personReference?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const user = getUser(request)
        const personAndDogs = await getPersonAndDogs(request.params.personReference, user)

        if (personAndDogs === undefined) {
          return h.response().code(404).takeover()
        }

        setActivityDetails(request, null)

        const backNav = addBackNavigation(request, true)

        return h.view(views.viewOwnerDetails, new ViewModel(personAndDogs, backNav))
      }
    }
  }
]
