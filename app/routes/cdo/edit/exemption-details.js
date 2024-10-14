const { routes, views } = require('../../../constants/cdo/dog')
const { anyLoggedInUser } = require('../../../auth/permissions.js')
const getUser = require('../../../auth/get-user')
const ViewModel = require('../../../models/cdo/edit/exemption-details')
const { getCourts, getPoliceForces, getCompanies } = require('../../../api/ddi-index-api')
const { addDateComponents } = require('../../../lib/date-helpers')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { validatePayload } = require('../../../schema/portal/edit/exemption-details')
const { updateExemption } = require('../../../api/ddi-index-api/exemption')
const { buildExemptionDetailsUpdatePayload } = require('../../../lib/payload-builders')
const { addBackNavigation, addBackNavigationForErrorCondition, extractBackNavParam } = require('../../../lib/back-helpers')

module.exports = [
  {
    method: 'GET',
    path: `${routes.editExemptionDetails.get}/{indexNumber}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const user = getUser(request)
        const cdo = await getCdo(request.params.indexNumber, user)

        if (cdo == null) {
          return h.response().code(404).takeover()
        }

        const courts = await getCourts(user)
        const policeForces = await getPoliceForces(user)
        const companies = await getCompanies(user)

        const exemption = cdo.exemption

        exemption.indexNumber = cdo.dog.indexNumber
        exemption.insuranceCompany = exemption.insurance[0]?.company
        exemption.insuranceRenewal = exemption.insurance[0]?.insuranceRenewal

        addDateComponents(exemption, 'certificateIssued')
        addDateComponents(exemption, 'cdoIssued')
        addDateComponents(exemption, 'cdoExpiry')
        addDateComponents(exemption, 'applicationFeePaid')
        addDateComponents(exemption, 'neuteringConfirmation')
        addDateComponents(exemption, 'microchipVerification')
        addDateComponents(exemption, 'joinedExemptionScheme')
        addDateComponents(exemption, 'insuranceRenewal')
        addDateComponents(exemption, 'microchipDeadline')
        addDateComponents(exemption, 'typedByDlo')
        addDateComponents(exemption, 'withdrawn')
        addDateComponents(exemption, 'nonComplianceLetterSent')

        const backNav = addBackNavigation(request)

        exemption.status = cdo?.dog?.status
        exemption.subStatus = cdo?.dog?.subStatus
        exemption.breaches = cdo?.dog?.breaches

        return h.view(views.editExemptionDetails, new ViewModel(exemption, courts, policeForces, companies, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.editExemptionDetails.post}/{dummy?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const user = getUser(request)
          const courts = await getCourts(user)
          const policeForces = await getPoliceForces(user)
          const companies = await getCompanies(user)

          const exemption = request.payload

          const backNav = addBackNavigationForErrorCondition(request)

          const viewModel = new ViewModel(exemption, courts, policeForces, companies, backNav, error)

          return h.view(views.editExemptionDetails, viewModel).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const payload = buildExemptionDetailsUpdatePayload(request.payload)

        await updateExemption(payload, getUser(request))

        return h.redirect(`${routes.viewDogDetails.get}/${payload.indexNumber}${extractBackNavParam(request)}`)
      }
    }
  }
]
