const { routes, views } = require('../../../constants/search')
const { getSearchCriteria, setSearchCriteria, getSearchResults, setSearchResults } = require('../../../session/cdo/search')
const ViewModel = require('../../../models/cdo/search/basic')
const searchSchema = require('../../../schema/portal/search/basic')
const { doSearch } = require('../../../api/ddi-index-api/search')
const { admin } = require('../../../auth/permissions')

module.exports = [{
  method: 'GET',
  path: routes.searchBasic.get,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const searchCriteria = getSearchCriteria(request)
      const searchResults = getSearchResults(request)
      return h.view(views.searchBasic, new ViewModel(searchCriteria, searchResults))
    }
  }
},
{
  method: 'POST',
  path: routes.searchBasic.post,
  options: {
    auth: { scope: [admin] },
    validate: {
      payload: searchSchema,
      failAction: async (request, h, error) => {
        const searchCriteria = { ...getSearchCriteria(request), ...request.payload }
        const searchResults = getSearchResults(request)
        return h.view(views.searchBasic, new ViewModel(searchCriteria, searchResults, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const searchCriteria = request.payload

      setSearchCriteria(request, searchCriteria)

      const results = await doSearch(searchCriteria)

      setSearchResults(request, results)

      return h.redirect(routes.searchBasic.get)
    }
  }
}]
