const { routes, views } = require('../../../constants/cdo/owner')
const { admin } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/postcode-lookup')
const { validatePayload } = require('../../../schema/portal/edit/postcode-lookup')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../lib/back-helpers')
const { getPersonByReference } = require('../../../api/ddi-index-api/person')
const { setPostcodeLookupDetails, getPostcodeLookupDetails } = require('../../../session/cdo/owner')

module.exports = [
  {
    method: 'GET',
    path: `${routes.postcodeLookup.get}/{personReference}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const personReference = request.params.personReference

        const person = await getPersonByReference(personReference)
        if (person == null) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request)

        const details = getPostcodeLookupDetails(request)

        const data = {
          personReference,
          postcode: details?.postcode,
          houseNumber: details?.houseNumber
        }

        return h.view(views.postcodeLookup, new ViewModel(data, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: routes.postcodeLookup.post,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const payload = request.payload

          const person = await getPersonByReference(payload.personReference)
          if (person == null) {
            return h.response().code(404).takeover()
          }

          const backNav = addBackNavigationForErrorCondition(request)

          const data = {
            personReference: person.personReference,
            postcode: payload.postcode,
            houseNumber: payload.houseNumber
          }

          const viewModel = new ViewModel(data, backNav, error)

          return h.view(views.postcodeLookup, viewModel).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const payload = request.payload

        setPostcodeLookupDetails(request, payload)

        return h.redirect(`${routes.selectAddressFromEdit.get}?src=${payload.srcHashParam}`)
      }
    }
  }
]
