const { routes, views } = require('../../../../constants/admin')
const { admin } = require('../../../../auth/permissions')
const ViewModel = require('../../../../models/common/add-or-remove')

module.exports = [
  {
    method: 'GET',
    path: `${routes.policeUsers.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        return h.view(views.addOrRemove, new ViewModel({
          optionText: 'Do you want to add or remove police officers?'
        }))
      }
    }
  }
]
