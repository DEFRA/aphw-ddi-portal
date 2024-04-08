const { routes, views } = require('../../constants/admin')
const { admin } = require('../../auth/permissions')
const ViewModel = require('../../models/admin/pseudonyms')
const { getUsers } = require('../../api/ddi-events-api/users')
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
  }
]
