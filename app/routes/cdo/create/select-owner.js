const { routes, views } = require('../../../constants/cdo/owner')
const { routes: dogRoutes } = require('../../../constants/cdo/dog')
const { getOwnerDetails, setOwnerDetails, setAddress } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/select-owner')
const { admin } = require('../../../auth/permissions')
const { getPersons } = require('../../../api/ddi-index-api/persons')
const { setInSession, getFromSession } = require('../../../session/session-wrapper')
const { setDog } = require('../../../session/cdo/dog')
const Joi = require('joi')
const { getPersonAndDogs } = require('../../../api/ddi-index-api/person')

module.exports = [{
  method: 'GET',
  path: routes.selectOwner.get,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const ownerDetails = getOwnerDetails(request)

      if (ownerDetails.dateOfBirth === null) {
        delete ownerDetails.dateOfBirth
      }

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
        address: Joi.number().required().messages({
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
      const ownerChosen = request.payload.address

      if (ownerChosen === -1) {
        return h.redirect(routes.postcodeLookupCreate.get)
      }

      const ownerResults = getFromSession(request, 'persons')
      const ownerDetails = ownerResults[ownerChosen]

      setOwnerDetails(request, { ...ownerDetails, dateOfBirth: ownerDetails.birthDate })
      setAddress(request, ownerDetails.address)

      const { dogs } = await getPersonAndDogs(ownerDetails.personReference)
      if (dogs && dogs.length === 1) {
        setDog(request, dogs[0])
        return h.redirect(dogRoutes.confirm.get)
      }

      return h.redirect(dogRoutes.microchipSearch.get)
    }
  }
}]
