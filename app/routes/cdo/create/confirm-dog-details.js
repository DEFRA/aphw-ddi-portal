const { routes, views } = require('../../../constants/cdo/dog')
const { routes: cdoRoutes } = require('../../../constants/cdo')
const { admin } = require('../../../auth/permissions')
const getUser = require('../../../auth/get-user')
const ViewModel = require('../../../models/cdo/create/confirm-dog-details')
const { getDogs, addAnotherDog } = require('../../../session/cdo/dog')
const { cdo } = require('../../../api/ddi-index-api')
const { buildCdoCreatePayload } = require('../../../lib/payload-builders')
const { getOwnerDetails, getAddress, getEnforcementDetails } = require('../../../session/cdo/owner')
const { setCreatedCdo } = require('../../../session/cdo')

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

        const owner = getOwnerDetails(request)
        const address = getAddress(request)
        const enforcementDetails = getEnforcementDetails(request)
        const dogs = getDogs(request)

        const cdoPayload = buildCdoCreatePayload(owner, address, enforcementDetails, dogs)

        const createdCdo = await cdo.createCdo(cdoPayload, getUser(request))

        request.yar.reset()

        setCreatedCdo(request, createdCdo)

        return h.redirect(cdoRoutes.created.get)
      }
    }
  }
]
