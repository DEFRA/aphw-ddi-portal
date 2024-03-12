const { routes, views } = require('../../../constants/cdo/owner')
const { getOwnerDetails, setOwnerDetails } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/owner-details')
const ownerDetailsSchema = require('../../../schema/portal/owner/owner-details')
const { admin } = require('../../../auth/permissions')

module.exports = [{
  method: 'GET',
  path: routes.selectOwner.get,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const ownerDetails = getOwnerDetails(request)
      return h.view(views.ownerDetails, new ViewModel(ownerDetails))
    }
  }
},
{
  method: 'POST',
  path: routes.selectOwner.post,
  options: {
    auth: { scope: [admin] },
    validate: {
      payload: ownerDetailsSchema,
      failAction: async (request, h, error) => {
        const ownerDetails = { ...getOwnerDetails(request), ...request.payload }
        return h.view(views.ownerDetails, new ViewModel(ownerDetails, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const ownerDetails = request.payload

      setOwnerDetails(request, ownerDetails)

      return h.redirect(routes.selectOwner.get)
    }
  }
}]
