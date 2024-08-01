const { routes, views } = require('../../../constants/cdo/owner')
const { routes: dogRoutes } = require('../../../constants/cdo/dog')
const { getOwnerDetails, setOwnerDetails, setAddress } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/select-owner')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { getPersons } = require('../../../api/ddi-index-api/persons')
const { setInSession, getFromSession } = require('../../../session/session-wrapper')
const { setExistingDogs } = require('../../../session/cdo/dog')
const Joi = require('joi')
const { getPersonAndDogs } = require('../../../api/ddi-index-api/person')
const { setPoliceForce } = require('../../../lib/model-helpers')
const { setRouteFlag, clearRouteFlag } = require('../../../session/routes')
const constants = require('../../../constants/forms')

module.exports = [{
  method: 'GET',
  path: routes.selectOwner.get,
  options: {
    auth: { scope: anyLoggedInUser },
    handler: async (request, h) => {
      const ownerDetails = getOwnerDetailsWithClear(request)

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
    auth: { scope: anyLoggedInUser },
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
        setAddress(request, {})
        setRouteFlag(request, constants.routeFlags.addOwner)
        return h.redirect(routes.postcodeLookupCreate.get)
      }

      const submittedOwnerDetails = getOwnerDetails(request)
      const ownerResults = getFromSession(request, 'persons')
      const ownerDetails = ownerResults[ownerChosen]
      let dateOfBirth = ownerDetails.birthDate
      const dateOfBirthEntered = submittedOwnerDetails.dateOfBirthEntered

      if (dateOfBirth === null && submittedOwnerDetails.dateOfBirth !== null) {
        dateOfBirth = submittedOwnerDetails.dateOfBirth
      }

      setOwnerDetails(request, { ...ownerDetails, dateOfBirth, dateOfBirthEntered })
      setAddress(request, ownerDetails.address)
      clearRouteFlag(request, constants.routeFlags.addOwner)

      const { dogs } = await getPersonAndDogs(ownerDetails.personReference)
      if (dogs && dogs.length >= 1) {
        setExistingDogs(request, dogs)
        return h.redirect(dogRoutes.selectExistingDog.get)
      }

      await setPoliceForce(request)

      return h.redirect(dogRoutes.microchipSearch.get)
    }
  }
}]

const getOwnerDetailsWithClear = request => {
  const ownerDetails = getOwnerDetails(request)

  if (!ownerDetails?.dateOfBirthEntered && request.query?.back) {
    ownerDetails.dateOfBirth = null
    ownerDetails['dateOfBirth-day'] = null
    ownerDetails['dateOfBirth-month'] = null
    ownerDetails['dateOfBirth-year'] = null
  }

  return ownerDetails
}
