const { routes, views, keys } = require('../../../constants/cdo/owner')
const { anyLoggedInUser } = require('../../../auth/permissions.js')
const getUser = require('../../../auth/get-user')
const ViewModel = require('../../../models/cdo/edit/owner-details')
const { validateBreedForCountryChoosingAddress } = require('../../../lib/validation-helpers')
const { getPersonByReference, updatePersonAndForce } = require('../../../api/ddi-index-api/person')
const { getCountries } = require('../../../api/ddi-index-api')
const { addDateComponents } = require('../../../lib/date-helpers')
const { validatePayload } = require('../../../schema/portal/edit/owner-details')
const { buildPersonUpdatePayload } = require('../../../lib/payload-builders')
const { addBackNavigation, addBackNavigationForErrorCondition, extractBackNavParam } = require('../../../lib/back-helpers')
const { setInSession } = require('../../../session/session-wrapper')
const { setPostcodeLookupDetails } = require('../../../session/cdo/owner')

const errorView = async (request, h, error) => {
  const user = getUser(request)
  const person = request.payload
  const countries = await getCountries(user)
  const backNav = addBackNavigationForErrorCondition(request)
  return h.view(views.editDetails, new ViewModel(person, countries, backNav, error)).code(400).takeover()
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.editDetails.get}/{personReference}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const user = getUser(request)
        const person = await getPersonByReference(request.params.personReference, user)

        if (person == null) {
          return h.response().code(404).takeover()
        }

        person.dateOfBirth = person.birthDate

        addDateComponents(person, 'dateOfBirth')

        const countries = await getCountries(user)

        const backNav = addBackNavigation(request)

        return h.view(views.editDetails, new ViewModel(person, countries, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.editDetails.post}/{dummy?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          return errorView(request, h, error)
        }
      },
      handler: async (request, h) => {
        const user = getUser(request)
        const person = request.payload

        const payload = buildPersonUpdatePayload(person)

        const error = await validateBreedForCountryChoosingAddress(request.payload.personReference, payload, user, 'country')
        if (error) {
          return errorView(request, h, error)
        }

        const updatePoliceResult = await updatePersonAndForce(payload, user)

        if (updatePoliceResult?.policeForceResult?.changed) {
          setInSession(request, keys.policeForceChangedResult, updatePoliceResult.policeForceResult)
          return h.redirect(routes.policeForceChanged.get)
        } else if (updatePoliceResult?.policeForceResult?.reason === 'Not found') {
          setPostcodeLookupDetails(request, null)
          setInSession(request, 'addresses', null)
          return h.redirect(`${routes.policeForceNotFound.get}/${person.personReference}`)
        } else {
          setPostcodeLookupDetails(request, null)
          setInSession(request, 'addresses', null)
          return h.redirect(`${routes.viewOwnerDetails.get}/${person.personReference}${extractBackNavParam(request)}`)
        }
      }
    }
  }
]
