const { routes, views } = require('../../../constants/cdo/dog')
const ViewModel = require('../../../models/cdo/delete/confim')
const { validatePayload } = require('../../../schema/portal/common/confirm')
const { admin } = require('../../../auth/permissions')
const { addBackNavigation, addBackNavigationForErrorCondition, extractBackNavParam } = require('../../../lib/back-helpers')
const { getDogDetails } = require('../../../api/ddi-index-api/dog')

module.exports = [{
  method: 'GET',
  path: `${routes.deleteGeneric.get}/{pk?}`,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const pk = request.params.pk

      const details = await buildDetails(pk)

      if (details.entity == null) {
        return h.response().code(404).takeover()
      }

      const backNav = addBackNavigation(request)

      return h.view(views.deleteGeneric, new ViewModel(details, backNav))
    }
  }
},
{
  method: 'POST',
  path: `${routes.deleteGeneric.post}/{pk?}`,
  options: {
    auth: { scope: [admin] },
    validate: {
      payload: validatePayload,
      failAction: async (request, h, error) => {
        const payload = request.payload

        const details = await buildDetails(payload.pk)

        const backNav = addBackNavigationForErrorCondition(request)

        return h.view(views.deleteGeneric, new ViewModel(details, backNav, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const payload = request.payload
      const pk = request.params.pk

      if (payload.confirm === 'N') {
        return h.redirect(`${routes.viewDogDetails.get}/${payload.pk}${extractBackNavParam(request)}`)
      }

      const details = await buildDetails(pk)

      // Do the delete

      return h.view(views.deleteGeneric, new ViewModel(details))
    }
  }
}]

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
    nameOrReference: `Dog ${pk}`,
    nameOrReferenceText: `${pk}`,
    entity
  }
}
