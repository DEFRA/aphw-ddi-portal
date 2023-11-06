const { routes, views } = require('../../../constants/owner')
const { getAddress, setAddress } = require('../../../session/register/owner')
const ViewModel = require('../../../models/register/owner/address')
const addressSchema = require('../../../schema/portal/owner/address')
const { getCounties, getCountries } = require('../../../api/dda-index-api')
const { admin } = require('../../../auth/permissions')

module.exports = [{
  method: 'GET',
  path: routes.address.get,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const counties = [''].concat(await getCounties())
      const countries = [''].concat(await getCountries())

      const address = getAddress(request)
      return h.view(views.address, new ViewModel(address, counties, countries))
    }
  }
},
{
  method: 'POST',
  path: routes.address.post,
  options: {
    validate: {
      options: {
        abortEarly: false
      },
      payload: addressSchema,
      failAction: async (request, h, error) => {
        const counties = [''].concat(await getCounties())
        const countries = [''].concat(await getCountries())

        const address = { ...getAddress(request), ...request.payload }
        return h.view(views.address, new ViewModel(address, counties, countries, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      setAddress(request, request.payload)
      return h.redirect(routes.dateOfBirth.get)
    }
  }
}]
