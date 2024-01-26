const Joi = require('joi')
const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/certificate')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { addBackNavigation } = require('../../../lib/back-helpers')
const { downloadCertificate } = require('../../../storage/repos/certificate')
const { sendMessage } = require('../../../messaging/outbound/certificate-request')

module.exports = [
  {
    method: 'GET',
    path: `${routes.certificate.get}/{indexNumber}`,
    options: {
      auth: { scope: [admin] },
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
    path: `${routes.certificate.post}`,
    options: {
      validate: {
        payload: Joi.object({
          indexNumber: Joi.string().required()
        }),
        failAction: async (request, h, error) => {
          return h.response().code(400).takeover()
        }
      },
      auth: { scope: [admin] },
      handler: async (request, h) => {
        console.log('Gen cert for index number', request.payload?.indexNumber)

        const cdo = await getCdo(request.payload.indexNumber)

        if (cdo === undefined) {
          return h.response().code(404).takeover()
        }

        console.log('Gen cert send message')

        const certificateId = await sendMessage(cdo)

        console.log('Gen cert certId from message', certificateId)

        try {
          const cert = await downloadCertificate(request.payload.indexNumber, certificateId)

          const downloadFilename = cdo.exemption?.exemptionOrder === '2023'
            ? `${cdo.dog.id} - ${cdo.dog.name} - Certificate of Exemption XL Bully.pdf`
            : `${cdo.dog.id} - ${cdo.dog.name} - Certificate of Exemption.pdf`

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
