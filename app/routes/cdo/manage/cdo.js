const Joi = require('joi')
const { routes, views } = require('../../../constants/cdo/index')
const { routes: dogRoutes } = require('../../../constants/cdo/dog')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../lib/back-helpers')
const { getManageCdoDetails } = require('../../../api/ddi-index-api/cdo')
const ViewModel = require('../../../models/cdo/manage/cdo')
const { getCdo, saveCdoTaskDetails } = require('../../../api/ddi-index-api/cdo')
const { ApiErrorFailure } = require('../../../errors/api-error-failure')
const getUser = require('../../../auth/get-user')

const mapBoomError = (e, request) => {
  const message = e.boom.payload.message

  const details = [{
    message,
    path: ['generalError'],
    type: 'custom'
  }]

  return new Joi.ValidationError(message, details)
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.manageCdo.get}/{dogIndex?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const backNav = addBackNavigation(request)

        const dogIndex = request.params.dogIndex
        const details = await getManageCdoDetails(dogIndex)

        if (details == null) {
          return h.response().code(404).takeover()
        }

        const cdo = await getCdo(dogIndex)
        return h.view(views.manageCdo, new ViewModel(details, cdo, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.manageCdo.post}/{dogIndex}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const dogIndex = request.params.dogIndex
        const taskName = 'issueCertificate'

        try {
          await saveCdoTaskDetails(dogIndex, taskName, {}, getUser(request))
  
          // const cert = await downloadCertificate(request.payload.indexNumber, certificateId)

          // const downloadFilename = cdo.exemption?.exemptionOrder === '2023'
          //  ? `${cdo.dog.id} - ${cdo.dog.name} - Certificate of Exemption XL Bully.pdf`
          //  : `${cdo.dog.id} - ${cdo.dog.name} - Certificate of Exemption.pdf`

          // return h.response(cert).type('application/pdf').header('Content-Disposition', `filename="${downloadFilename}"`)
          return h.redirect(`${dogRoutes.certificate.get}/${dogIndex}`)
        } catch (e) {
          if (e instanceof ApiErrorFailure) {
            const error = mapBoomError(e, request)
  
            const details = await getManageCdoDetails(dogIndex)
            const cdo = await getCdo(dogIndex)
            const backNav = addBackNavigationForErrorCondition(request)

            return h.view(views.manageCdo, new ViewModel(details, cdo, backNav, error)).code(400).takeover()
          }

          throw e
        }
      }
    }
  }
]
