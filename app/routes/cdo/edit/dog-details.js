const { routes, views, keys } = require('../../../constants/cdo/dog')
const ViewModel = require('../../../models/cdo/edit/dog-details')
const { validatePayload } = require('../../../schema/portal/edit/dog-details')
const { getDogDetails, updateDogDetails } = require('../../../api/ddi-index-api/dog')
const { getBreeds } = require('../../../api/ddi-index-api/dog-breeds')
const { addDateComponents, removeDateComponents } = require('../../../lib/date-helpers')
const { admin } = require('../../../auth/permissions')

module.exports = [{
  method: 'GET',
  path: `${routes.editDogDetails.get}/{indexNumber?}`,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const indexNumber = request.params.indexNumber
      const dog = await getDogDetails(indexNumber)
      const { breeds } = await getBreeds()

      if (dog[keys.dateOfBirth] !== undefined) {
        addDateComponents(dog, keys.dateOfBirth)
      }
      if (dog[keys.dateOfDeath] !== undefined) {
        addDateComponents(dog, keys.dateOfDeath)
      }
      if (dog[keys.dateExported] !== undefined) {
        addDateComponents(dog, keys.dateExported)
      }
      if (dog[keys.dateStolen] !== undefined) {
        addDateComponents(dog, keys.dateStolen)
      }

      return h.view(views.editDogDetails, new ViewModel(dog, breeds))
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

        return h.view(views.editDogDetails, new ViewModel(dog, breeds, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const dog = request.payload

      removeDateComponents(dog, keys.dateOfBirth)
      removeDateComponents(dog, keys.dateOfDeath)
      removeDateComponents(dog, keys.dateExported)
      removeDateComponents(dog, keys.dateStolen)

      await updateDogDetails(dog)

      return h.redirect(`${routes.viewDogDetails.get}/${dog.indexNumber}`)
    }
  }
}]
