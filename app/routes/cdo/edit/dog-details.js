const { routes, views, keys } = require('../../../constants/cdo/dog')
const getUser = require('../../../auth/get-user')
const ViewModel = require('../../../models/cdo/edit/dog-details')
const { validatePayload } = require('../../../schema/portal/edit/dog-details')
const { getDogDetails, updateDogDetails } = require('../../../api/ddi-index-api/dog')
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
        const dog = await getDogDetails(indexNumber)

        if (dog == null) {
          return h.response().code(404).takeover()
        }

        const { breeds } = await getBreeds()

        if (dog[keys.dateOfBirth]) {
          addDateComponents(dog, keys.dateOfBirth)
        }
        if (dog[keys.dateOfDeath]) {
          addDateComponents(dog, keys.dateOfDeath)
        }
        if (dog[keys.dateExported]) {
          addDateComponents(dog, keys.dateExported)
        }
        if (dog[keys.dateStolen]) {
          addDateComponents(dog, keys.dateStolen)
        }
        if (dog[keys.dateUntraceable]) {
          addDateComponents(dog, keys.dateUntraceable)
        }

        const backNav = addBackNavigation(request)

        return h.view(views.editDogDetails, new ViewModel(dog, breeds, backNav))
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

          return h.view(views.editDogDetails, new ViewModel(dog, breeds, backNav, error)).code(400).takeover()
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

            return h.view(views.editDogDetails, new ViewModel(dog, breeds, backNav, error)).code(400).takeover()
          }

          throw e
        }
      }
    }

  }
]
