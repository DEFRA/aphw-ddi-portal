const { routes, views, keys } = require('../../../constants/cdo/dog')
const getUser = require('../../../auth/get-user')
const ViewModel = require('../../../models/cdo/edit/dog-details')
const { validatePayload } = require('../../../schema/portal/edit/dog-details')
const { updateDogDetails } = require('../../../api/ddi-index-api/dog')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { getBreeds } = require('../../../api/ddi-index-api/dog-breeds')
const { addDateComponents } = require('../../../lib/date-helpers')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { addBackNavigation, addBackNavigationForErrorCondition, extractBackNavParam } = require('../../../lib/back-helpers')
const { ApiConflictError } = require('../../../errors/api-conflict-error')
const { microchipValidation } = require('../../../schema/portal/cdo/dog-details')

const mapBoomError = (e, request) => {
  const { microchipNumber, microchipNumber2 } = request.payload

  const disallowedMicrochipIds = e.boom.payload.microchipNumbers

  const validationPayload = {
    microchipNumber,
    microchipNumber2
  }
  const { error } = microchipValidation(disallowedMicrochipIds).validate(validationPayload, { abortEarly: false })
  return error
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.editDogDetails.get}/{indexNumber?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const indexNumber = request.params.indexNumber
        const cdo = await getCdo(indexNumber)

        if (cdo?.dog == null) {
          return h.response().code(404).takeover()
        }

        const { breeds } = await getBreeds()

        if (cdo.dog[keys.dateOfBirth]) {
          addDateComponents(cdo.dog, keys.dateOfBirth)
        }
        if (cdo.dog[keys.dateOfDeath]) {
          addDateComponents(cdo.dog, keys.dateOfDeath)
        }
        if (cdo.dog[keys.dateExported]) {
          addDateComponents(cdo.dog, keys.dateExported)
        }
        if (cdo.dog[keys.dateStolen]) {
          addDateComponents(cdo.dog, keys.dateStolen)
        }
        if (cdo.dog[keys.dateUntraceable]) {
          addDateComponents(cdo.dog, keys.dateUntraceable)
        }

        const backNav = addBackNavigation(request)

        const country = cdo.person?.addresses[0]?.address?.country?.country
        return h.view(views.editDogDetails, new ViewModel(cdo.dog, breeds, country, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.editDogDetails.post}/{dummy?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const { breeds } = await getBreeds()

          const dog = request.payload

          const backNav = addBackNavigationForErrorCondition(request)

          const country = request.payload.country
          return h.view(views.editDogDetails, new ViewModel(dog, breeds, country, backNav, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const dog = request.payload

        try {
          await updateDogDetails(dog, getUser(request))

          return h.redirect(`${routes.viewDogDetails.get}/${dog.indexNumber}${extractBackNavParam(request)}`)
        } catch (e) {
          if (e instanceof ApiConflictError) {
            const error = mapBoomError(e, request)

            const { breeds } = await getBreeds()

            const dog = request.payload

            const backNav = addBackNavigationForErrorCondition(request)

            const country = request.payload.country
            return h.view(views.editDogDetails, new ViewModel(dog, breeds, country, backNav, error)).code(400).takeover()
          }

          throw e
        }
      }
    }

  }
]
