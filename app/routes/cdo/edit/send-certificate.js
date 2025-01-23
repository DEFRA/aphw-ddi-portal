const { routes, views } = require('../../../constants/cdo/dog')
const { anyLoggedInUser } = require('../../../auth/permissions.js')
const getUser = require('../../../auth/get-user')
const ViewModel = require('../../../models/cdo/edit/send-certificate')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../lib/back-helpers')
const { downloadCertificate } = require('../../../storage/repos/certificate')
const { sendMessage } = require('../../../messaging/outbound/certificate-request')
const { extractEmail } = require('../../../lib/model-helpers')
const { sanitiseText } = require('../../../lib/sanitise')
const { issueCertTask } = require('../manage/tasks/issue-cert')

module.exports = [
  {
    method: 'GET',
    path: `${routes.sendCertificate.get}/{indexNumber}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const user = getUser(request)
        const cdo = await getCdo(request.params.indexNumber, user)

        if (cdo == null) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request, false)

        return h.view(views.sendCertificate, new ViewModel(cdo, {}, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.sendCertificate.post}/{dummy?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      // As a default radio value is used, we can't post invalid form values, hence no validation
      handler: async (request, h) => {
        const payload = request.payload
        const indexNumber = payload.indexNumber
        const sendOption = payload.sendOption
        const user = getUser(request)

        if (sendOption === 'email') {
          const cdo = await getCdo(indexNumber, user)

          if (cdo === undefined) {
            return h.response().code(404).takeover()
          }

          const certificateId = await sendMessage(cdo, user)
          await downloadCertificate(indexNumber, certificateId)
          const email = sanitiseText(extractEmail(cdo.person.person_contacts))

          console.log('JB email', email)
          console.log('JB filename', certificateId)

          const error = await issueCertTask(indexNumber, user, { filename: `${certificateId}.pdf` })
          if (error) {
            const backNav = addBackNavigationForErrorCondition(request)
            return h.view(views.sendCertificate, new ViewModel(cdo, request.payload, backNav, error))
          }
        }

        return h.redirect(`${routes.sendCertificateConfirmation.get}/${indexNumber}/${sendOption}`)
      }
    }
  }
]
