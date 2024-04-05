const { routes, views } = require('../../../constants/search')
const ViewModel = require('../../../models/cdo/search/basic')
const searchSchema = require('../../../schema/portal/search/basic')
const { doSearch } = require('../../../api/ddi-index-api/search')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { addBackNavigation } = require('../../../lib/back-helpers')

module.exports = [{
  method: 'GET',
  path: routes.searchBasic.get,
  options: {
    auth: { scope: anyLoggedInUser },
    handler: async (request, h) => {
      const searchCriteria = request.query

      if (searchCriteria.searchType === undefined) {
        searchCriteria.searchType = 'dog'
      }

      const backNav = addBackNavigation(request)

      if (searchCriteria.searchTerms === undefined) {
        return h.view(views.searchBasic, new ViewModel(searchCriteria, [], backNav))
      }

      const errors = searchSchema.validate(searchCriteria, { abortEarly: false })
      if (errors.error) {
        return h.view(views.searchBasic, new ViewModel(searchCriteria, [], backNav, errors.error)).code(400).takeover()
      }

      const results = await doSearch(searchCriteria)

      return h.view(views.searchBasic, new ViewModel(searchCriteria, results, backNav))
    }
  }
}]
