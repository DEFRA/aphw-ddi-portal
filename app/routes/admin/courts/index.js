const { routes, views } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/common/add-or-remove')
const { validatePayload } = require('../../../schema/portal/common/do-you-want')

module.exports = [
  {
    method: 'GET',
    path: `${routes.courts.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        return h.view(views.addOrRemove, new ViewModel({
          recordTypeText: 'court',
          recordType: 'court',
          showAdminBreadcrumb: true
        }))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.courts.post}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          return h.view(views.addOrRemove, new ViewModel({
            recordTypeText: 'court',
            recordType: 'court'
          }, undefined, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const addRemoveCourt = request.payload.addOrRemove
        let redirectUrl

        if (addRemoveCourt === 'remove') {
          redirectUrl = routes.removeCourt.get
        } else {
          redirectUrl = routes.addCourt.get
        }

        return h.redirect(redirectUrl)
      }
    }
  }
]
