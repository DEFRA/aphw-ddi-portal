const { routes, views } = require('../../../constants/owner')
const { getOwner } = require('../../../session/owner')
const ViewModel = require('../../../models/register/owner/summary')
const schema = require('../../../schema/portal/owner')
const createRegistrationNumber = require('../../../create-registration-number')

module.exports = [
  {
    method: 'GET',
    path: routes.summary.get,
    options: {
      handler: async (request, h) => {
        const owner = getOwner(request)

        const { error } = schema.validate(owner, { abortEarly: false })

        return h.view(views.summary, new ViewModel(owner, error))
      }
    }
  },
  {
    method: 'POST',
    path: routes.summary.post,
    options: {
      handler: async (request, h) => {
        const owner = getOwner(request)

        const { error } = schema.validate(owner, { abortEarly: false })

        if (error) {
          return h.view(views.summary, new ViewModel(owner, error)).code(400).takeover()
        }

        request.yar.reset()

        request.yar.set('registration-number', createRegistrationNumber())

        return h.redirect(routes.confirmation.get)
      }
    }
  }
]
