const { routes, views } = require('../../../constants/cdo/dog')
const { routes: cdoRoutes } = require('../../../constants/cdo')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/create/confirm-dog-details')
const { getDogs } = require('../../../session/cdo/dog')
const dogDetailsSchema = require('../../../schema/portal/cdo/dog-details')

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
      validate: {
        payload: dogDetailsSchema
      },
      handler: async (request, h) => {
        return h.redirect(cdoRoutes.created.get)
      }
    }
  }
]
