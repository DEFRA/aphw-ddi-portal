const { routes, views } = require('../../../constants/cdo/owner')
const { anyLoggedInUser } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/common/postcode-lookup')
const { validatePayload } = require('../../../schema/portal/edit/postcode-lookup')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../lib/back-helpers')
const { getPersonByReference } = require('../../../api/ddi-index-api/person')
const { setPostcodeLookupDetails, getPostcodeLookupDetails, clearPostcodeSession } = require('../../../session/cdo/owner')
const { getUser } = require('../../../auth')

module.exports = [
  {
    method: 'GET',
    path: `${routes.postcodeLookupEdit.get}/{personReference}/{clearSession?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const { personReference, clearSession } = request.params

        if (clearSession === 'clear') {
          clearPostcodeSession(request)
          return h.redirect(`${routes.postcodeLookupEdit.get}/${personReference}?src=${request.query.src}`)
        }

        const user = getUser(request)

        const person = await getPersonByReference(personReference, user)
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

        return h.view(views.postcodeLookupEdit, new ViewModel(data, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.postcodeLookupEdit.post}/{dummy?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const user = getUser(request)
          const payload = request.payload

          const person = await getPersonByReference(payload.personReference, user)
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

          return h.view(views.postcodeLookupEdit, viewModel).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const payload = request.payload

        setPostcodeLookupDetails(request, payload)

        const backNav = addBackNavigation(request)

        return h.redirect(`${routes.selectAddressFromEdit.get}${backNav.srcHashParam}`)
      }
    }
  }
]
