const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/exemption-details')
const { getCourts, getPoliceForces, getCompanies } = require('../../../api/ddi-index-api')
const { addDateComponents } = require('../../../lib/date-helpers')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { validatePayload } = require('../../../schema/portal/edit/exemption-details')
const { updateExemption } = require('../../../api/ddi-index-api/exemption')
const { buildExemptionDetailsUpdatePayload } = require('../../../lib/payload-builders')

module.exports = [
  {
    method: 'GET',
    path: `${routes.editExemptionDetails.get}/{indexNumber}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const cdo = await getCdo(request.params.indexNumber)

        if (cdo == null) {
          return h.response().code(404).takeover()
        }

        const courts = await getCourts()
        const policeForces = await getPoliceForces()
        const companies = await getCompanies()

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

        return h.view(views.editExemptionDetails, new ViewModel(exemption, courts, policeForces, companies))
      }
    }
  },
  {
    method: 'POST',
    path: routes.editExemptionDetails.post,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const courts = await getCourts()
          const policeForces = await getPoliceForces()
          const companies = await getCompanies()

          const exemption = request.payload

          const viewModel = new ViewModel(exemption, courts, policeForces, companies, error)

          return h.view(views.editExemptionDetails, viewModel).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const payload = buildExemptionDetailsUpdatePayload(request.payload)

        await updateExemption(payload)

        return h.redirect(`${routes.viewDogDetails.get}/${payload.indexNumber}`)
      }
    }
  }
]
