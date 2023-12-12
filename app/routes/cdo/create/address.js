const { routes, views } = require('../../../constants/owner')
const { getAddress, setAddress, getEnforcementDetails, setEnforcementDetails } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/address')
const addressSchema = require('../../../schema/portal/owner/address')
const { admin } = require('../../../auth/permissions')
const { lookupPoliceForceByPostcode } = require('../../../api/police-area')

module.exports = [{
  method: 'GET',
  path: routes.address.get,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const address = getAddress(request)

      return h.view(views.address, new ViewModel(address))
    }
  }
},
{
  method: 'POST',
  path: routes.address.post,
  options: {
    validate: {
      options: {
        abortEarly: false
      },
      payload: addressSchema,
      failAction: async (request, h, error) => {
        const address = { ...getAddress(request), ...request.payload }
        return h.view(views.address, new ViewModel(address, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      setAddress(request, request.payload)

      const enforcementDetails = getEnforcementDetails(request) || {}
      const policeForce = await lookupPoliceForceByPostcode(request.payload?.postcode)

      if (policeForce) {
        enforcementDetails.policeForce = policeForce.id
        setEnforcementDetails(request, enforcementDetails)
      }

      return h.redirect(routes.enforcementDetails.get)
    }
  }
}]
