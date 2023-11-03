const Joi = require('joi')
const { routes, views } = require('../../../constants/owner')
const { getPhoneNumber, setPhoneNumber } = require('../../../session/register/owner')
const ViewModel = require('../../../models/register/owner/phone-number.js')
const phoneSchema = require('../../../schema/portal/owner/phone-number')

module.exports = [
  {
    method: 'GET',
    path: routes.phoneNumber.get,
    handler: (request, h) => {
      const phone = getPhoneNumber(request)

      return h.view(views.phoneNumber, new ViewModel(phone))
    }
  },
  {
    method: 'POST',
    path: routes.phoneNumber.post,
    options: {
      validate: {
        payload: Joi.object({
          phoneNumber: phoneSchema
        }),
        failAction: async (request, h, error) => {
          const phone = getPhoneNumber(request)
          console.log(error)
          return h.view(views.phoneNumber, new ViewModel(phone, error)).code(400).takeover()
        }
      },
      handler: (request, h) => {
        const phoneNumber = request.payload.phoneNumber

        setPhoneNumber(request, phoneNumber)

        return h.redirect(routes.email.get)
      }
    }
  }
]
