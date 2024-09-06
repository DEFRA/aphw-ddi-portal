const { routes: dogRoutes, views } = require('../../../constants/cdo/dog')
const { routes: ownerRoutes } = require('../../../constants/cdo/owner')
const { anyLoggedInUser } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/create/confirm-dog-details')
const { getDogs, addAnotherDog } = require('../../../session/cdo/dog')
const { getEnforcementDetails, getAddress } = require('../../../session/cdo/owner')
const { setPoliceForce } = require('../../../lib/model-helpers')
const { getUser } = require('../../../auth')

module.exports = [
  {
    method: 'GET',
    path: dogRoutes.confirm.get,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const dogs = getDogs(request)

        if (dogs?.length === 1 && dogs[0].indexNumber) {
          return h.redirect(dogRoutes.applicationType.get)
        }

        return h.view(views.confirm, new ViewModel(dogs))
      }
    }
  },
  {
    method: 'POST',
    path: dogRoutes.confirm.post,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        if (request.payload.addAnotherDog != null) {
          addAnotherDog(request)

          return h.redirect(dogRoutes.microchipSearch.get)
        }

        const dogs = getDogs(request)
        if (dogs?.length === 1 && dogs[0].indexNumber) {
          return h.redirect(`${dogRoutes.applicationType.get}/1`)
        }

        const enforcementDetails = getEnforcementDetails(request)
        const addressDetails = getAddress(request)
        if (!enforcementDetails?.policeForce && addressDetails?.postcode) {
          await setPoliceForce(request, getUser(request), addressDetails.postcode)
        }

        return h.redirect(ownerRoutes.enforcementDetails.get)
      }
    }
  }
]
