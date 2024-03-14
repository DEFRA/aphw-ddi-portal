const { routes: dogRoutes, views } = require('../../../constants/cdo/dog')
const { routes: ownerRoutes } = require('../../../constants/cdo/owner')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/create/confirm-dog-details')
const { getDogs, addAnotherDog } = require('../../../session/cdo/dog')

module.exports = [
  {
    method: 'GET',
    path: dogRoutes.confirm.get,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const dogs = getDogs(request)

        console.log('dogs', dogs)
        const temp = new ViewModel(dogs)
        console.log('dogModel', JSON.parse(JSON.stringify(temp.model)))

        return h.view(views.confirm, new ViewModel(dogs))
      }
    }
  },
  {
    method: 'POST',
    path: dogRoutes.confirm.post,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        if (request.payload.addAnotherDog != null) {
          addAnotherDog(request)

          return h.redirect(dogRoutes.microchipSearch.get)
        }

        const dogs = getDogs(request)
        if (dogs?.length === 1 && dogs[0].indexNumber) {
          return h.redirect(`${dogRoutes.applicationType.get}/1`)
        }

        return h.redirect(ownerRoutes.enforcementDetails.get)
      }
    }
  }
]
