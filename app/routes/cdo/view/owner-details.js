const { routes, views } = require('../../../constants/owner')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/owner-details')
const { getPersonAndDogs } = require('../../../api/ddi-index-api/person')

module.exports = [
  {
    method: 'GET',
    path: `${routes.viewOwnerDetails.get}/{personReference?}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const personAndDogs = await getPersonAndDogs(request.params.personReference)

        if (personAndDogs === undefined) {
          return h.response().code(404).takeover()
        }

        return h.view(views.viewOwnerDetails, new ViewModel(personAndDogs))
      }
    }
  }
]
