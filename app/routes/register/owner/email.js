const Joi = require('joi')
const { routes, views } = require('../../../constants/owner')
const { getEmail, setEmail } = require('../../../session/register/owner')
const ViewModel = require('../../../models/register/owner/email')
const emailSchema = require('../../../schema/portal/owner/email')

module.exports = [{
  method: 'GET',
  path: routes.email.get,
  options: {
    handler: async (request, h) => {
      const email = getEmail(request)
      return h.view(views.email, new ViewModel(email))
    }
  }
},
{
  method: 'POST',
  path: routes.email.post,
  options: {
    validate: {
      payload: Joi.object({
        email: emailSchema
      }),
      failAction: async (request, h, error) => {
        const email = getEmail(request)
        return h.view(views.email, new ViewModel(email, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const email = request.payload.email
      setEmail(request, email)
      return h.redirect(routes.summary.get)
    }
  }
}]
