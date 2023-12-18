const { routes, views } = require('../../../constants/owner')
const { admin } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/update/owner-details')
const { getPersonByReference } = require('../../../api/ddi-index-api/person')

module.exports = [
  {
    method: 'GET',
    path: `${routes.updateDetails.get}/{personReference}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const person = await getPersonByReference(request.params.personReference)

        if (person === undefined) {
          return h.response().code(404).takeover()
        }

        return h.view(views.updateDetails, new ViewModel(person))
      }
    }
  }
]
