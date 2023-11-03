const Joi = require('joi')
const { routes, views } = require('../../../constants/owner')
const { getAddressPostcode, setAddressPostcode } = require('../../../session/register/owner')
const ViewModel = require('../../../models/register/owner/postcode')

module.exports = [
  {
    method: 'GET',
    path: routes.postcode.get,
    handler: (request, h) => {
      const postcode = getAddressPostcode(request)

      return h.view(views.postcode, new ViewModel(postcode))
    }
  },
  {
    method: 'POST',
    path: routes.postcode.post,
    options: {
      validate: {
        payload: Joi.object({
          postcode: Joi.string().required()
        }),
        failAction: async (request, h, error) => {
          const postcode = getAddressPostcode(request)
          return h.view(views.postcode, new ViewModel(postcode, error)).code(400).takeover()
        }
      },
      handler: (request, h) => {
        const postcode = request.payload.postcode

        setAddressPostcode(request, { postcode })

        return h.redirect(routes.selectAddress.get)
      }
    }
  }
]
