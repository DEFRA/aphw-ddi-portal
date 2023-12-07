const { routes, views } = require('../../../constants/search')
const { getSearchCriteria, setSearchCriteria, getSearchResults, setSearchResults } = require('../../../session/cdo/search')
const ViewModel = require('../../../models/cdo/search/basic')
const searchSchema = require('../../../schema/portal/search/basic')
const { admin } = require('../../../auth/permissions')

module.exports = [{
  method: 'GET',
  path: routes.searchBasic.get,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const searchCriteria = getSearchCriteria(request)
      const searchResults = getSearchResults(request)
      console.log('1getSearchCriteria', searchCriteria)
      console.log('1searchResults', searchResults)
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
        console.log('2getSearchCriteria', searchCriteria)
        console.log('2searchResults', searchResults)
        return h.view(views.searchBasic, new ViewModel(searchCriteria, searchResults, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const searchTerms = request.payload
      console.log('2SearchCriteria', request.payload)

      setSearchCriteria(request, searchTerms)

      // const results = doSearch(searchTerms)
      const results = [
        { name: 'Rover', dateOfBirth: '01/02/2020' },
        { name: 'Butch', dateOfBirth: '05/05/2021' }]

      setSearchResults(results)

      return h.redirect(routes.searchBasic.get)
    }
  }
}]
