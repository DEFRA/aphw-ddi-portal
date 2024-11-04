const { routes, views } = require('../../../constants/cdo/owner')
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
const { determineNextScreenAfterAddressChange } = require('../../../lib/route-helpers')

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

        const origPerson = await getPersonByReference(request.params.personReference, user)

        const updatePoliceResult = await updatePersonAndForce(payload, user)

        const oldCountry = person?.address?.country
        const newCountry = origPerson?.address?.country

        const defaultRoute = `${routes.viewOwnerDetails.get}/${person.personReference}${extractBackNavParam(request)}`
        const nextScreen = determineNextScreenAfterAddressChange(request, oldCountry, newCountry, updatePoliceResult, person.personReference, defaultRoute)
        return h.redirect(nextScreen)
      }
    }
  }
]
