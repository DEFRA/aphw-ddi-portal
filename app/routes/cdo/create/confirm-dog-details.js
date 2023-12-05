const { routes, views } = require('../../../constants/cdo/dog')
const { routes: cdoRoutes } = require('../../../constants/cdo')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/create/confirm-dog-details')
const { getDogs, addAnotherDog } = require('../../../session/cdo/dog')

module.exports = [
  {
    method: 'GET',
    path: routes.confirm.get,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const dogs = getDogs(request)

        return h.view(views.confirm, new ViewModel(dogs))
      }
    }
  },
  {
    method: 'POST',
    path: routes.confirm.post,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        if (request.payload.addAnotherDog != null) {
          addAnotherDog(request)

          return h.redirect(routes.details.get)
        }

        return h.redirect(cdoRoutes.created.get)
      }
    }
  }
]
