const { routes, views } = require('../../constants/admin')
const { admin } = require('../../auth/permissions')
const ViewModel = require('../../models/common/add-or-remove')

module.exports = [
  {
    method: 'GET',
    path: `${routes.courts.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        return h.view(views.addOrRemove, new ViewModel({
          recordTypeText: 'court',
          recordType: 'court'
        }))
      }
    }
  }
]
