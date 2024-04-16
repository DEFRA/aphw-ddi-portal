const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/delete/confim')
const { addBackNavigation } = require('../../../lib/back-helpers')
const { getDogDetails } = require('../../../api/ddi-index-api/dog')
module.exports = [
  {
    method: 'GET',
    path: `${routes.deleteDog.get}/{indexNumber?}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const details = await buildDetails(request.params.indexNumber)

        if (details.entity === undefined) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request)

        return h.view(views.confirmDeleteGeneric, new ViewModel(details, backNav))
      }
    }
  }
]

/**
 * @param pk
 * @returns {Promise<ConfirmDeleteDetails>}
 */
const buildDetails = async (pk) => {
  const entity = await getDogDetails(pk)

  return {
    action: 'delete',
    pk,
    recordTypeText: 'dog',
    nameOrReference: `${pk}`,
    recordType: 'dog',
    entity
  }
}
