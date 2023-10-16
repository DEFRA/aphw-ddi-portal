const { routes, views } = require('../../../constants/owner')

module.exports = {
  method: 'GET',
  path: routes.confirmation.get,
  options: {
    handler: async (request, h) => {
      const registrationNumber = request.yar.get('registration-number')

      return h.view(views.confirmation, { registrationNumber })
    }
  }
}
