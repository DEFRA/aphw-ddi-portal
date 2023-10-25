const { routes, views } = require('../../../constants/owner')
const { setName, getName } = require('../../../session/register/owner')
const ViewModel = require('../../../models/register/owner/name')
const nameSchema = require('../../../schema/portal/owner/name')

module.exports = [{
  method: 'GET',
  path: routes.name.get,
  options: {
    handler: async (request, h) => {
      const name = getName(request)
      return h.view(views.name, new ViewModel(name))
    }
  }
},
{
  method: 'POST',
  path: routes.name.post,
  options: {
    validate: {
      payload: nameSchema,
      failAction: async (request, h, error) => {
        const name = { ...getName(request), ...request.payload }
        return h.view(views.name, new ViewModel(name, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const name = request.payload

      setName(request, name)
      return h.redirect(routes.postcode.get)
    }
  }
}]
