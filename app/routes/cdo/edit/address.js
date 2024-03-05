const { routes, views } = require('../../../constants/cdo/owner')
const ViewModel = require('../../../models/cdo/create/address')
const addressSchema = require('../../../schema/portal/owner/address')
const { admin } = require('../../../auth/permissions')
const getUser = require('../../../auth/get-user')
const { getPersonByReference } = require('../../../api/ddi-index-api/person')
const { addBackNavigation, addBackNavigationForErrorCondition, getMainReturnPoint } = require('../../../lib/back-helpers')
const { buildPersonAddressUpdatePayload } = require('../../../lib/payload-builders')
const { updatePerson } = require('../../../api/ddi-index-api/person')
const { setPostcodeLookupDetails } = require('../../../session/cdo/owner')

module.exports = [{
  method: 'GET',
  path: `${routes.editAddress.get}/{personReference}`,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const personReference = request.params.personReference

      const person = await getPersonByReference(personReference)
      if (person == null) {
        return h.response().code(404).takeover()
      }

      const backNav = addBackNavigation(request)

      const form = {
        personReference,
        formAction: routes.editAddress.post,
        source: 'edit'
      }

      return h.view(views.address, new ViewModel(person.address, form, backNav))
    }
  }
},
{
  method: 'POST',
  path: routes.editAddress.post,
  options: {
    validate: {
      options: {
        abortEarly: false
      },
      payload: addressSchema,
      failAction: async (request, h, error) => {
        const backNav = addBackNavigationForErrorCondition(request)

        const person = request.payload

        const form = {
          personReference: person.personReference,
          formAction: routes.editAddress.post,
          source: 'edit'
        }

        return h.view(views.address, new ViewModel(person, form, backNav, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const person = await getPersonByReference(request.payload.personReference)
      if (person == null) {
        return h.response().code(404).takeover()
      }

      const updatePayload = buildPersonAddressUpdatePayload(person, request.payload)

      await updatePerson(updatePayload, getUser(request))

      setPostcodeLookupDetails(request, null)

      return h.redirect(getMainReturnPoint(request))
    }
  }
}]
