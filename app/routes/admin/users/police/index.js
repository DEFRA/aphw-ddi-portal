const { routes, views } = require('../../../../constants/admin')
const { admin } = require('../../../../auth/permissions')
const ViewModel = require('../../../../models/common/add-or-remove')
const { validatePayload } = require('../../../../schema/portal/common/do-you-want')
const { initialisePoliceUsers } = require('../../../../session/admin/police-users')

module.exports = [
  {
    method: 'GET',
    path: `${routes.policeUsers.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        initialisePoliceUsers(request, [])
        return h.view(views.addOrRemove, new ViewModel({
          optionText: 'Do you want to add or remove police officers?'
        }))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.policeUsers.post}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          return h.view(views.addOrRemove, new ViewModel({
            optionText: 'Do you want to add or remove police officers?'
          }, undefined, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const addRemovePoliceUser = request.payload.addOrRemove
        let redirectUrl

        if (addRemovePoliceUser === 'remove') {
          redirectUrl = routes.removePoliceUser.get
        } else {
          redirectUrl = routes.addPoliceUser.get
        }

        return h.redirect(redirectUrl)
      }
    }
  }
]
