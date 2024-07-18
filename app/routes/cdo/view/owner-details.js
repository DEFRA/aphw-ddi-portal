const { routes, views } = require('../../../constants/cdo/owner')
const { anyLoggedInUser } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/owner-details')
const { getPersonAndDogs } = require('../../../api/ddi-index-api/person')
const { addBackNavigation } = require('../../../lib/back-helpers')
const { setActivityDetails } = require('../../../session/cdo/activity')

module.exports = [
  {
    method: 'GET',
    path: `${routes.viewOwnerDetails.get}/{personReference?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        try {
          console.log('view/owner-details1', request.params.personReference)
          const personAndDogs = await getPersonAndDogs(request.params.personReference)
          console.log('view/owner-details2')

          if (personAndDogs === undefined) {
            return h.response().code(404).takeover()
          }

          console.log('view/owner-details3')
          setActivityDetails(request, null)

          console.log('view/owner-details4')
          const backNav = addBackNavigation(request, true)

          console.log('view/owner-details5')
          return h.view(views.viewOwnerDetails, new ViewModel(personAndDogs, backNav))
        } catch (err) {
          console.log('route view/owner-details error', err)
          throw err
        }
      }
    }
  }
]
