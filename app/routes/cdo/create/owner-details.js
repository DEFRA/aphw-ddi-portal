const { routes, views } = require('../../../constants/cdo/owner')
const { getOwnerDetails, setOwnerDetails } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/owner-details')
const { validatePayload } = require('../../../schema/portal/owner/owner-details')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { UTCDate } = require('@date-fns/utc')
const { addDateComponents } = require('../../../lib/date-helpers')
const { clearCdo } = require('../../../session/cdo')

module.exports = [{
  method: 'GET',
  path: routes.ownerDetails.get,
  options: {
    auth: { scope: anyLoggedInUser },
    handler: async (request, h) => {
      if (request.query.clear === 'true') {
        clearCdo(request)
        return h.redirect(routes.ownerDetails.get)
      }

      const ownerDetails = getOwnerDetails(request) || {}

      addDateComponents(ownerDetails, 'dateOfBirth')

      return h.view(views.ownerDetails, new ViewModel(ownerDetails))
    }
  }
},
{
  method: 'POST',
  path: routes.ownerDetails.post,
  options: {
    auth: { scope: anyLoggedInUser },
    validate: {
      payload: validatePayload,
      failAction: async (request, h, error) => {
        const ownerDetails = { ...getOwnerDetails(request), ...request.payload }
        return h.view(views.ownerDetails, new ViewModel(ownerDetails, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const ownerDetails = request.payload

      const gotOwnerDetails = getOwnerDetails(request) || {}

      setOwnerDetails(request, hydrateOwnerDetails({ ...gotOwnerDetails, ...ownerDetails }))

      return h.redirect(routes.selectOwner.get)
    }
  }
}]

const hydrateOwnerDetails = (ownerDetails = {}) => {
  const { dateOfBirth, personReference, ...hydratedOwnerDetailBase } = ownerDetails
  const dobDay = ownerDetails['dateOfBirth-day']
  const dobMonth = ownerDetails['dateOfBirth-month']
  const dobYear = ownerDetails['dateOfBirth-year']

  if (!dobDay || !dobMonth || !dobYear) {
    return {
      ...hydratedOwnerDetailBase,
      dateOfBirthEntered: null
    }
  }

  return {
    ...hydratedOwnerDetailBase,
    dateOfBirth: new UTCDate(`${dobYear}-${dobMonth}-${dobDay}`),
    dateOfBirthEntered: new UTCDate(`${dobYear}-${dobMonth}-${dobDay}`)
  }
}
