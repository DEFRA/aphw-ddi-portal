const Joi = require('joi')
const { routes, views } = require('../../../constants/cdo/owner')
const { getPostcodeAddresses } = require('../../../api/os-places')
const { setAddress, getPostcodeLookupDetails, setPostcodeLookupDetails } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/select-address')
const { admin } = require('../../../auth/permissions')
const { addBackNavigation, getMainReturnPoint } = require('../../../lib/back-helpers')
const { setInSession, getFromSession } = require('../../../session/session-wrapper')
const { getPersonByReference, updatePerson } = require('../../../api/ddi-index-api/person')
const { buildPersonAddressUpdatePayload } = require('../../../lib/payload-builders')
const getUser = require('../../../auth/get-user')

module.exports = [
  {
    method: 'GET',
    path: routes.selectAddressFromEdit.get,
    options: {
      auth: { scope: [admin] },
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
      auth: { scope: [admin] },
      validate: {
        payload: Joi.object({
          address: Joi.number().min(0).required()
        }),
        failAction: async (request, h, error) => {
          const details = getPostcodeLookupDetails(request)
          const addresses = getFromSession(request, 'addresses')

          return h.view(views.selectAddress, new ViewModel(details, addresses, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const personReference = getPostcodeLookupDetails(request)?.personReference
        const selectedAddress = getFromSession(request, 'addresses')[request.payload.address]

        const person = await getPersonByReference(personReference)

        const updatePayload = buildPersonAddressUpdatePayload(person, selectedAddress)

        await updatePerson(updatePayload, getUser(request))

        setPostcodeLookupDetails(request, null)

        return h.redirect(getMainReturnPoint(request))
      }
    }
  }
]
