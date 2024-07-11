const Joi = require('joi')
const { routes, views } = require('../../../constants/cdo/dog')
const { anyLoggedInUser } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/certificate')
const { getCdo, getManageCdoDetails } = require('../../../api/ddi-index-api/cdo')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../lib/back-helpers')
const { downloadCertificate } = require('../../../storage/repos/certificate')
const { sendMessage } = require('../../../messaging/outbound/certificate-request')
const { issueCertTask } = require('../manage/tasks/issue-cert')
const getUser = require('../../../auth/get-user')

module.exports = [
  {
    method: 'GET',
    path: `${routes.certificate.get}/{indexNumber}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const cdo = await getCdo(request.params.indexNumber)

        if (cdo === undefined) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request)

        return h.view(views.certificate, new ViewModel(cdo.dog.indexNumber, request.query.origin, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.certificate.post}/{dummy?}`,
    options: {
      validate: {
        payload: Joi.object({
          indexNumber: Joi.string().required()
        }),
        failAction: async (request, h, error) => {
          return h.response().code(400).takeover()
        }
      },
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const indexNumber = request.payload.indexNumber
        const cdo = await getCdo(indexNumber)
        const origin = request.query.origin

        if (cdo === undefined) {
          return h.response().code(404).takeover()
        }

        const certificateId = await sendMessage(cdo, getUser(request))

        try {
          const cert = await downloadCertificate(indexNumber, certificateId)

          const downloadFilename = cdo.exemption?.exemptionOrder === '2023'
            ? `${cdo.dog.id} - ${cdo.dog.name} - Certificate of Exemption XL Bully.pdf`
            : `${cdo.dog.id} - ${cdo.dog.name} - Certificate of Exemption.pdf`

          const cdoTaskDetails = await getManageCdoDetails(indexNumber)

          if ((cdoTaskDetails.tasks.certificateIssued.available || cdoTaskDetails.tasks.certificateIssued.completed) && cdo.dog.status === 'Pre-exempt') {
            // Pre-exempt and all tasks completed
            const error = await issueCertTask(indexNumber, getUser(request))
            if (error) {
              const backNav = addBackNavigationForErrorCondition(request)
              return h.view(views.certificate, new ViewModel(indexNumber, origin, backNav, error))
            }
          }

          return h.response(cert).type('application/pdf').header('Content-Disposition', `filename="${downloadFilename}"`)
        } catch (err) {
          console.log(`Error generating certificate: ${err} ${err.stack}`)
          if (err.type === 'CertificateNotFound') {
            return h.response().code(404).takeover()
          }

          throw err
        }
      }
    }
  }
]
