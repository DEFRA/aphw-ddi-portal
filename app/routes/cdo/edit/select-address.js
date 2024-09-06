const Joi = require('joi')
const { routes, views } = require('../../../constants/cdo/owner')
const { getPostcodeAddresses } = require('../../../api/os-places')
const { setAddress, getPostcodeLookupDetails, setPostcodeLookupDetails } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/select-address')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { addBackNavigation, getMainReturnPoint } = require('../../../lib/back-helpers')
const { setInSession, getFromSession } = require('../../../session/session-wrapper')
const { getPersonByReference, updatePerson } = require('../../../api/ddi-index-api/person')
const { buildPersonAddressUpdatePayload } = require('../../../lib/payload-builders')
const getUser = require('../../../auth/get-user')
const { validateBreedForCountryChoosingAddress } = require('../../../lib/validation-helpers')

module.exports = [
  {
    method: 'GET',
    path: routes.selectAddressFromEdit.get,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const details = getPostcodeLookupDetails(request) || {}
        details.source = 'edit'
        const postcode = details?.postcode
        const houseNumber = details?.houseNumber
        const addresses = await getPostcodeAddresses(postcode ? postcode.toUpperCase() : '', houseNumber)

        setInSession(request, 'addresses', addresses)

        if (addresses && addresses.length === 1) {
          setAddress(request, addresses[0])
        }

        const backNav = addBackNavigation(request)
        details.backLink = backNav.backLink
        details.srcHashParam = backNav.srcHashParam

        return h.view(views.selectAddress, new ViewModel(details, addresses))
      }
    }
  },
  {
    method: 'POST',
    path: routes.selectAddressFromEdit.post,
    options: {
      auth: { scope: anyLoggedInUser },
      validate: {
        payload: Joi.object({
          address: Joi.number().min(0).required().messages(
            { '*': 'Select an address.' }
          )
        }),
        failAction: async (request, h, error) => {
          const details = getPostcodeLookupDetails(request)
          const addresses = getFromSession(request, 'addresses')

          return h.view(views.selectAddress, new ViewModel(details, addresses, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const user = getUser(request)
        const details = getPostcodeLookupDetails(request)
        const addresses = getFromSession(request, 'addresses')
        const personReference = details?.personReference
        const selectedAddress = addresses[request.payload.address]

        const person = await getPersonByReference(personReference, user)

        const updatePayload = buildPersonAddressUpdatePayload(person, selectedAddress)

        const error = await validateBreedForCountryChoosingAddress(personReference, updatePayload, user)
        if (error) {
          return h.view(views.selectAddress, new ViewModel(details, addresses, error)).code(400).takeover()
        }

        await updatePerson(updatePayload, user)

        setPostcodeLookupDetails(request, null)
        setInSession(request, 'addresses', null)

        return h.redirect(getMainReturnPoint(request))
      }
    }
  }
]
