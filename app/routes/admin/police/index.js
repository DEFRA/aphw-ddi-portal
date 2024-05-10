const { routes, views } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/common/add-or-remove')
const { validatePayload } = require('../../../schema/portal/common/do-you-want')

module.exports = [
  {
    method: 'GET',
    path: `${routes.police.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        return h.view(views.addOrRemove, new ViewModel({
          recordTypeText: 'police force',
          recordType: 'police'
        }))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.police.post}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          return h.view(views.addOrRemove, new ViewModel({
            recordTypeText: 'police force',
            recordType: 'police'
          }, undefined, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const addRemoveCourt = request.payload.addOrRemove
        let redirectUrl

        if (addRemoveCourt === 'remove') {
          redirectUrl = routes.removePoliceForce.get
        } else {
          redirectUrl = routes.addPoliceForce.get
        }

        return h.redirect(redirectUrl)
      }
    }
  }
]
