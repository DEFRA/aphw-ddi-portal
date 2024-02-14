const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/dog-details')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { addBackNavigation } = require('../../../lib/back-helpers')

const getSourceEntity = async (pk, source) => {
  return source === 'dog'
    ? await getCdo(pk)
    : null
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.viewDogActivities.get}/{pk}/{source}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const cdo = await getSourceEntity(request.params.pk, request.params.source)
        console.log(cdo)
        if (cdo === null || cdo === undefined) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request, true)

        return h.view(views.viewDogActivities, new ViewModel(cdo, backNav))
      }
    }
  }
]
