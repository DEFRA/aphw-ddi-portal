const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/common/confim')
const DeletedViewModel = require('../../../models/cdo/delete/deleted')
const { addBackNavigation, addBackNavigationForErrorCondition, extractBackNavParam } = require('../../../lib/back-helpers')
const { getDogDetails, deleteDog } = require('../../../api/ddi-index-api/dog')
const { validatePayload } = require('../../../schema/portal/common/confirm')
const { getUser } = require('../../../auth')

module.exports = [
  {
    method: 'GET',
    path: `${routes.deleteDog.get}/{indexNumber?}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const details = await buildDetails(request.params.indexNumber)

        const backNav = addBackNavigation(request)

        return h.view(views.confirmDeleteGeneric, new ViewModel(details, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.deleteDog.post}/{indexNumber?}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const details = await buildDetails(request.params.indexNumber)

          const backNav = addBackNavigationForErrorCondition(request)

          return h.view(views.confirmDeleteGeneric, new ViewModel(details, backNav, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const payload = request.payload
        const pk = request.params.indexNumber

        if (payload.confirm === 'N') {
          return h.redirect(`${routes.viewDogDetails.get}/${pk}${extractBackNavParam(request)}`)
        }
        const details = await buildDetails(pk)

        await deleteDog(pk, getUser(request))

        const backNav = addBackNavigation(request)

        return h.view(views.deleteGeneric, new DeletedViewModel(details, backNav))
      }
    }
  }
]

/**
 * @param pk
 * @returns {Promise<ConfirmDetails>}
 */
const buildDetails = async (pk) => {
  // check if dog exists
  await getDogDetails(pk)

  return {
    action: 'delete',
    pk,
    recordTypeText: 'dog',
    nameOrReference: `${pk}`,
    confirmReferenceText: `${pk}`,
    nameOrReferenceText: `Dog ${pk}`
  }
}
