const { routes, views } = require('../../../constants/search')
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
      const searchCriteria = request.query

      if (searchCriteria.searchType === undefined) {
        searchCriteria.searchType = 'dog'
      }

      if (searchCriteria.searchTerms === undefined) {
        return h.view(views.searchBasic, new ViewModel(searchCriteria, [], request))
      }

      const errors = searchSchema.validate(searchCriteria, { abortEarly: false })
      if (errors.error) {
        return h.view(views.searchBasic, new ViewModel(searchCriteria, [], request, errors.error)).code(400).takeover()
      }

      const results = await doSearch(searchCriteria)

      return h.view(views.searchBasic, new ViewModel(searchCriteria, results, request))
    }
  }
}]
