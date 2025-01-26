const { routes, views } = require('../../../constants/cdo/dog')
const { anyLoggedInUser } = require('../../../auth/permissions.js')
const getUser = require('../../../auth/get-user')
const ViewModel = require('../../../models/cdo/edit/withdraw')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { withdrawDog } = require('../../../api/ddi-index-api/dog')
const { addBackNavigation } = require('../../../lib/back-helpers')
const { validateWithdrawal } = require('../../../schema/portal/cdo/withdraw')

module.exports = [
  {
    method: 'GET',
    path: `${routes.withdraw.get}/{indexNumber}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const user = getUser(request)
        const cdo = await getCdo(request.params.indexNumber, user)

        if (cdo == null) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request, false)

        return h.view(views.withdraw, new ViewModel(cdo, {}, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.withdraw.post}/{dummy?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      validate: {
        payload: validateWithdrawal,
        failAction: async (request, h, error) => {
          const user = getUser(request)
          const cdo = await getCdo(request.payload.indexNumber, user)

          if (cdo == null) {
            return h.response().code(404).takeover()
          }
          const backNav = addBackNavigation(request, false)

          return h.view(views.withdraw, new ViewModel(cdo, request.payload, backNav, error)).code(400).takeover()
        }
      },
      // As a default radio value is used, we can't post invalid form values, hence no validation
      handler: async (request, h) => {
        const payload = request.payload

        const details = {
          indexNumber: payload.indexNumber,
          withdrawOption: payload.withdrawOption
        }

        if (payload.email) {
          details.updateEmail = true
          details.email = payload.email
        }

        await withdrawDog(details, getUser(request))

        return h.redirect(`${routes.withdrawalConfirmation.get}/${details.indexNumber}/${details.withdrawOption}`)
      }
    }
  }]
