const { routes, views } = require('../../../constants/cdo/dog')
const { getOwnerDetails } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/select-existing-dog')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { setDog, getExistingDogs } = require('../../../session/cdo/dog')
const Joi = require('joi')

module.exports = [{
  method: 'GET',
  path: routes.selectExistingDog.get,
  options: {
    auth: { scope: anyLoggedInUser },
    handler: async (request, h) => {
      const ownerDetails = getOwnerDetails(request)

      const dogResults = getExistingDogs(request)

      return h.view(views.selectExistingDog, new ViewModel(ownerDetails, dogResults))
    }
  }
},
{
  method: 'POST',
  path: routes.selectExistingDog.post,
  options: {
    auth: { scope: anyLoggedInUser },
    validate: {
      payload: Joi.object({
        dog: Joi.number().required().messages({
          '*': 'Select an option'
        })
      }),
      failAction: async (request, h, error) => {
        const ownerDetails = getOwnerDetails(request)

        const dogResults = getExistingDogs(request)

        return h.view(views.selectExistingDog, new ViewModel(ownerDetails, dogResults, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const dogChosen = request.payload.dog

      if (dogChosen === -1) {
        setDog(request, {})
        return h.redirect(routes.microchipSearch.get)
      }

      const dogResults = getExistingDogs(request)

      setDog(request, dogResults[dogChosen])

      return h.redirect(routes.applicationType.get)
    }
  }
}]
