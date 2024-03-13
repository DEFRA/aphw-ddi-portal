const { routes, views } = require('../../../constants/cdo/owner')
const { getOwnerDetails, setOwnerDetails, setAddress } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/select-owner')
const { admin } = require('../../../auth/permissions')
const { getPersons } = require('../../../api/ddi-index-api/persons')
const { setInSession, getFromSession } = require('../../../session/session-wrapper')
const Joi = require('joi')

module.exports = [{
  method: 'GET',
  path: routes.selectOwner.get,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const ownerDetails = getOwnerDetails(request)
      const ownerResults = await getPersons(ownerDetails)

      setInSession(request, 'persons', ownerResults)

      if (!ownerResults.length) {
        return h.redirect(routes.postcodeLookupCreate.get)
      } else if (ownerResults.length === 1) {
        setAddress(request, ownerResults[0].address)
      }

      return h.view(views.selectOwner, new ViewModel(ownerDetails, ownerResults))
    }
  }
},
{
  method: 'POST',
  path: routes.selectOwner.post,
  options: {
    auth: { scope: [admin] },
    validate: {
      payload: Joi.object({
        addresses: Joi.number().required().messages({
          '*': 'Select an address'
        })
      }),
      failAction: async (request, h, error) => {
        const ownerDetails = { ...getOwnerDetails(request), ...request.payload }
        const ownerResults = getFromSession(request, 'persons')

        return h.view(views.selectOwner, new ViewModel(ownerDetails, ownerResults, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const ownerDetails = request.payload

      setOwnerDetails(request, ownerDetails)

      return h.redirect(routes.selectOwner.get)
    }
  }
}]
