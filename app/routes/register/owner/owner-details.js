const { routes, views } = require('../../../constants/owner')
const { getOwnerDetails, setOwnerDetails } = require('../../../session/register/owner')
const ViewModel = require('../../../models/register/owner/owner-details')
const ownerDetailsSchema = require('../../../schema/portal/owner/owner-details')
const { admin } = require('../../../auth/permissions')

module.exports = [{
  method: 'GET',
  path: routes.ownerDetails.get,
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
  path: routes.ownerDetails.post,
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

      return h.redirect(routes.postcode.get)
    }
  }
}]
