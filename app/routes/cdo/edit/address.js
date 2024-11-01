const { routes, views, keys } = require('../../../constants/cdo/owner')
const ViewModel = require('../../../models/cdo/create/address')
const addressSchema = require('../../../schema/portal/owner/address')
const { anyLoggedInUser } = require('../../../auth/permissions')
const getUser = require('../../../auth/get-user')
const { getPersonByReference } = require('../../../api/ddi-index-api/person')
const { getCountries } = require('../../../api/ddi-index-api/countries')
const { addBackNavigation, addBackNavigationForErrorCondition, getMainReturnPoint } = require('../../../lib/back-helpers')
const { buildPersonAddressUpdatePayload } = require('../../../lib/payload-builders')
const { updatePersonAndForce } = require('../../../api/ddi-index-api/person')
const { getAddress, setPostcodeLookupDetails } = require('../../../session/cdo/owner')
const { setInSession } = require('../../../session/session-wrapper')
const { validateBreedForCountryChoosingAddress } = require('../../../lib/validation-helpers')
const { logValidationError } = require('../../../lib/log-helpers')

const errorView = async (request, h, error) => {
  const user = getUser(request)

  const backNav = addBackNavigationForErrorCondition(request)
  const person = request.payload
  const countries = await getCountries(user)
  const form = {
    personReference: person.personReference,
    source: 'edit'
  }
  return h.view(views.address, new ViewModel(person, form, backNav, countries, error)).code(400).takeover()
}

module.exports = [{
  method: 'GET',
  path: `${routes.editAddress.get}/{personReference}/{fromSessionOrDb?}`,
  options: {
    auth: { scope: anyLoggedInUser },
    handler: async (request, h) => {
      const user = getUser(request)
      const personReference = request.params.personReference
      const fromSessionOrDb = request.params.fromSessionOrDb

      let person
      if (fromSessionOrDb === 'session') {
        person = {
          address: getAddress(request)
        }
      } else {
        person = await getPersonByReference(personReference, user)
        if (person == null) {
          return h.response().code(404).takeover()
        }
      }

      const backNav = addBackNavigation(request)

      const countries = await getCountries(user)

      const form = {
        personReference,
        source: 'edit'
      }

      return h.view(views.address, new ViewModel(person.address, form, backNav, countries))
    }
  }
},
{
  method: 'POST',
  path: `${routes.editAddress.post}/{personReference}/{fromSessionOrDb?}`,
  options: {
    auth: { scope: anyLoggedInUser },
    validate: {
      options: {
        abortEarly: false
      },
      payload: addressSchema,
      failAction: async (request, h, error) => {
        logValidationError(error, routes.editAddress.post)

        return await errorView(request, h, error)
      }
    },
    handler: async (request, h) => {
      const user = getUser(request)
      const person = await getPersonByReference(request.payload.personReference, user)
      if (person == null) {
        return h.response().code(404).takeover()
      }

      const updatePayload = buildPersonAddressUpdatePayload(person, request.payload)

      const error = await validateBreedForCountryChoosingAddress(request.payload.personReference, updatePayload, user, 'country')
      if (error) {
        return await errorView(request, h, error)
      }

      const updatePoliceResult = await updatePersonAndForce(updatePayload, user)

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
        return h.redirect(getMainReturnPoint(request))
      }
    }
  }
}]
