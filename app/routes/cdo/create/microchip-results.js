const { routes, views } = require('../../../constants/cdo/dog')
const ViewModel = require('../../../models/cdo/create/microchip-results')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { getMicrochipResults, setDog } = require('../../../session/cdo/dog')
const { getOwnerDetails } = require('../../../session/cdo/owner')
const { getDogDetails } = require('../../../api/ddi-index-api/dog')
const { hasAreYouSureRadioBeenSelected } = require('../../../schema/portal/common/single-submit')
const { validatePayloadBuilder } = require('../../../schema/common/validatePayload')

const getCombinedResults = request => {
  const details = getMicrochipResults(request)
  const ownerDetails = getOwnerDetails(request)
  details.newFirstName = ownerDetails.firstName
  details.newLastName = ownerDetails.lastName
  details.dogId = request.params?.dogId
  return details
}

const getDogDetailsFromDB = async results => {
  const dog = await getDogDetails(results.results[0].dogIndex)
  return dog
}

module.exports = [{
  method: 'GET',
  path: `${routes.microchipResults.get}/{dogId?}`,
  options: {
    auth: { scope: anyLoggedInUser },
    handler: async (request, h) => {
      const details = getCombinedResults(request)

      return h.view(views.microchipResults, new ViewModel(details))
    }
  }
},
{
  method: 'POST',
  path: `${routes.microchipResults.post}/{dogId?}`,
  options: {
    auth: { scope: anyLoggedInUser },
    validate: {
      payload: validatePayloadBuilder(hasAreYouSureRadioBeenSelected),
      failAction: async (request, h, error) => {
        const details = getCombinedResults(request)

        return h.view(views.microchipResults, new ViewModel(details, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      if (!request.payload.confirm) {
        return h.redirect(`${routes.microchipResultsStop.get}/${request.params.dogId}`)
      }

      const dog = await getDogDetailsFromDB(getMicrochipResults(request))
      setDog(request, dog)

      return h.redirect(`${routes.applicationType.get}/${request.params.dogId}`)
    }
  }
}]
