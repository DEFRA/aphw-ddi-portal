const { routes, views } = require('../../../constants/owner')
const { getBirthDate, setBirthDate } = require('../../../session/owner')
const ViewModel = require('../../../models/register/owner/date-of-birth')
const dobSchema = require('../../../schema/portal/owner/date-of-birth')

module.exports = [{
  method: 'GET',
  path: routes.dateOfBirth.get,
  options: {
    handler: async (request, h) => {
      const dob = getBirthDate(request)
      return h.view(views.dateOfBirth, new ViewModel(dob))
    }
  }
},
{
  method: 'POST',
  path: routes.dateOfBirth.post,
  options: {
    validate: {
      payload: dobSchema,
      failAction: async (request, h, error) => {
        const dob = { ...getBirthDate(request), ...request.payload }
        return h.view(views.dateOfBirth, new ViewModel(dob, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      setBirthDate(request, request.payload)
      return h.redirect(routes.phoneNumber.get)
    }
  }
}]
