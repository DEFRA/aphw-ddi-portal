const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/create/confirm-delete-dog')
const { getDog, getDogs, deleteDog } = require('../../../session/cdo/dog')

module.exports = [
  {
    method: 'GET',
    path: `${routes.delete.get}/{dogId}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const dogs = getDogs(request)

        if (dogs <= 1) {
          return h.redirect(routes.details.get)
        }

        const dog = getDog(request)

        dog.id = request.params?.dogId

        return h.view(views.delete, new ViewModel(dog))
      }
    }
  },
  {
    method: 'POST',
    path: routes.delete.post,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const dogs = getDogs(request)

        if (dogs <= 1) {
          return h.response().code(400).takeover()
        }

        deleteDog(request)

        return h.redirect(routes.confirm.get)
      }
    }
  }
]
