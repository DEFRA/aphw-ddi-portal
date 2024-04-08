const { routes, views } = require('../../constants/admin')
const { admin } = require('../../auth/permissions')
const ViewModel = require('../../models/admin/pseudonyms')
const { getUsers, createUser, deleteUser } = require('../../api/ddi-events-api/users')
const { getUser } = require('../../auth')

module.exports = [
  {
    method: 'GET',
    path: `${routes.pseudonyms.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const users = await getUsers(getUser(request))
        return h.view(views.pseudonyms, new ViewModel(users))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.pseudonyms.post}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const actioningUser = getUser(request)

        if (request.payload.remove) {
          await deleteUser(request.payload.remove, actioningUser)
        } else {
          const payload = {
            username: request.payload.email,
            pseudonym: request.payload.pseudonym
          }
          await createUser(payload, actioningUser)
        }

        const users = await getUsers(actioningUser)
        return h.view(views.pseudonyms, new ViewModel(users))
      }
    }
  }
]
