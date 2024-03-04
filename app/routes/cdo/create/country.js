const { routes, views } = require('../../../constants/cdo/owner')
const { routes: dogRoutes } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/create/country')
const { getCountries } = require('../../../api/ddi-index-api')
const { validatePayload } = require('../../../schema/portal/cdo/country')

module.exports = [
  {
    method: 'GET',
    path: routes.country.get,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const countries = await getCountries()

        return h.view(views.country, new ViewModel(countries))
      }
    }
  },
  {
    method: 'POST',
    path: routes.country.post,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const countries = await getCountries()

          return h.view(views.country, new ViewModel(countries, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        return h.redirect(dogRoutes.details.get)
      }
    }
  }
]
