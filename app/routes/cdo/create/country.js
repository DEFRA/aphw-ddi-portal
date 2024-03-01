const { routes, views } = require('../../../constants/cdo/owner')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/create/country')
const { getCountries } = require('../../../api/ddi-index-api')

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
  }
  // {
  //   method: 'POST',
  //   path: routes.confirm.post,
  //   options: {
  //     auth: { scope: [admin] },
  //     handler: async (request, h) => {
  //       if (request.payload.addAnotherDog != null) {
  //         addAnotherDog(request)
  //
  //         return h.redirect(routes.details.get)
  //       }
  //
  //       return h.redirect(ownerRoutes.enforcementDetails.get)
  //     }
  //   }
  // }
]
