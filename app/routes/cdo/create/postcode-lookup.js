const { routes, views } = require('../../../constants/cdo/owner')
const { admin } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/common/postcode-lookup')
const { validatePayload } = require('../../../schema/portal/cdo/postcode-lookup')
const { getOwnerDetails, setOwnerDetails } = require('../../../session/cdo/owner')
const { addBackNavigation } = require('../../../lib/back-helpers')

module.exports = [
  {
    method: 'GET',
    path: `${routes.postcodeLookupCreate.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const details = getOwnerDetails(request)

        const backLink = addBackNavigation(request)

        const data = {
          postcode: details?.postcode,
          houseNumber: details?.houseNumber
        }

        return h.view(views.postcodeLookupCreate, new ViewModel(data, backLink))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.postcodeLookupCreate.post}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const payload = request.payload

          const backLink = addBackNavigation(request)

          const data = {
            postcode: payload.postcode,
            houseNumber: payload.houseNumber
          }

          return h.view(views.postcodeLookupCreate, new ViewModel(data, backLink, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const payload = request.payload

        const ownerDetails = getOwnerDetails(request)
        setOwnerDetails(request, {
          ...ownerDetails,
          ...payload
        })

        return h.redirect(`${routes.selectAddress.get}`)
      }
    }
  }
]
