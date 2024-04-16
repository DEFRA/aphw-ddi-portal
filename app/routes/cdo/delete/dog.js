const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/delete/confim')
const { addBackNavigation } = require('../../../lib/back-helpers')
const { getDogDetails } = require('../../../api/ddi-index-api/dog')
const { NotFoundError } = require('../../../errors/notFoundError')
module.exports = [
  {
    method: 'GET',
    path: `${routes.deleteDog.get}/{indexNumber?}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        let details

        try {
          details = await buildDetails(request.params.indexNumber)
        } catch (e) {
          if (e instanceof NotFoundError) {
            return h.response().code(404).takeover()
          }
          throw e
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
  const dogDetails = await getDogDetails(pk)

  if (dogDetails === undefined) {
    throw new NotFoundError(`Dog not found with index number ${pk}`)
  }

  return {
    action: 'delete',
    pk,
    recordTypeText: 'dog',
    nameOrReference: `${pk}`,
    nameOrReferenceText: `${pk}`
  }
}
