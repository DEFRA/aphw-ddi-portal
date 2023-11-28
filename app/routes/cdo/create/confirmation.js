const { routes, views } = require('../../../constants/owner')
const { admin } = require('../../../auth/permissions')

module.exports = {
  method: 'GET',
  path: routes.confirmation.get,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const registrationNumber = request.yar.get('person-registration-number')

      return h.view(views.confirmation, { registrationNumber })
    }
  }
}
