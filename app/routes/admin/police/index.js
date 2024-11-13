const { routes, views } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/common/add-or-remove')
const UserListModel = require('../../../models/admin/users/police/user-list')
const { validatePayload } = require('../../../schema/portal/common/do-you-want')
const { getUsers } = require('../../../api/ddi-index-api/users')
const { getUser } = require('../../../auth')
const { getPoliceForces } = require('../../../api/ddi-index-api/police-forces')
const { policeOfficerListQuerySchema } = require('../../../schema/portal/admin/users')

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
  },
  {
    method: 'GET',
    path: `${routes.policeUserList.get}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        query: policeOfficerListQuerySchema
      }
    },
    handler: async (request, h) => {
      const backLink = routes.index
      const policeForce = request.query.policeForce

      const user = getUser(request)
      const { users, count } = await getUsers(user)

      const policeForces = await getPoliceForces(user)

      return h.view(views.userList, new UserListModel({ users, count, policeForces, policeForce }, {}, backLink))
    }
  }
]
