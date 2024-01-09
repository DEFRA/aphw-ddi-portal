const { routes, views, keys } = require('../../../constants/cdo/dog')
const ViewModel = require('../../../models/cdo/edit/dog-details')
const { validatePayload } = require('../../../schema/portal/edit/dog-details')
const { getDogDetails, updateDogDetails } = require('../../../api/ddi-index-api/dog')
const { getBreeds } = require('../../../api/ddi-index-api/dog-breeds')
const { addDateComponents } = require('../../../lib/date-helpers')
const { admin } = require('../../../auth/permissions')
const { addBackNavigation } = require('../../../lib/back-helpers')

module.exports = [{
  method: 'GET',
  path: `${routes.editDogDetails.get}/{indexNumber?}`,
  options: {
    auth: { scope: [admin] },
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

      const backNav = addBackNavigation(request)

      return h.view(views.editDogDetails, new ViewModel(dog, breeds, backNav))
    }
  }
},
{
  method: 'POST',
  path: routes.editDogDetails.post,
  options: {
    auth: { scope: [admin] },
    validate: {
      payload: validatePayload,
      failAction: async (request, h, error) => {
        const { breeds } = await getBreeds()

        const dog = request.payload

        const backNav = addBackNavigation(request)

        return h.view(views.editDogDetails, new ViewModel(dog, breeds, backNav, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const dog = request.payload

      await updateDogDetails(dog)

      return h.redirect(`${routes.viewDogDetails.get}/${dog.indexNumber}`)
    }
  }
}]
