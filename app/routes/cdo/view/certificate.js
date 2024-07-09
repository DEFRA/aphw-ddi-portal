const Joi = require('joi')
const { routes, views } = require('../../../constants/cdo/dog')
const { anyLoggedInUser } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/certificate')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { updateStatus } = require('../../../api/ddi-index-api/dog')
const { addBackNavigation } = require('../../../lib/back-helpers')
const { downloadCertificate } = require('../../../storage/repos/certificate')
const { sendMessage } = require('../../../messaging/outbound/certificate-request')
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

        return h.view(views.certificate, new ViewModel(cdo.dog.indexNumber, backNav))
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

          if ((cdoTaskDetails.certificateIssued.available || cdoTaskDetails.certificateIssued.completed) && cdo.dog.status !== 'Exempt') {
            // Pre-exempt and all tasks completed
            await updateStatus({ indexNumber, newStatus: 'Exempt' }, getUser(request))
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
