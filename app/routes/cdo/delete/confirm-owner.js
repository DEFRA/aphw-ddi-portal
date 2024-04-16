const { routes, views } = require('../../../constants/cdo/owner')
const ViewModel = require('../../../models/cdo/delete/confim')
const { validatePayload } = require('../../../schema/portal/common/confirm')
const { admin } = require('../../../auth/permissions')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../lib/back-helpers')
const { getPersonByReference } = require('../../../api/ddi-index-api/person')

module.exports = [{
  method: 'GET',
  path: `${routes.delete.get}/{pk?}`,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const pk = request.params.pk

      const details = await buildDetails(pk)

      if (details.entity == null) {
        return h.response().code(404).takeover()
      }

      const backNav = addBackNavigation(request)

      return h.view(views.delete, new ViewModel(details, backNav))
    }
  }
},
{
  method: 'POST',
  path: `${routes.delete.post}/{pk?}`,
  options: {
    auth: { scope: [admin] },
    validate: {
      payload: validatePayload,
      failAction: async (request, h, error) => {
        const payload = request.payload

        const details = await buildDetails(payload.pk)

        const backNav = addBackNavigationForErrorCondition(request)

        return h.view(views.delete, new ViewModel(details, backNav, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      // const payload = request.payload

      // Do the delete or abort

      return h.view(views.delete, new ViewModel())
    }
  }
}]

const buildDetails = async (pk) => {
  const entity = await getPersonByReference(pk)

  return {
    action: 'delete',
    pk,
    recordTypeText: 'the owner',
    nameOrReference: `for ${entity.firstName} ${entity.lastName}`,
    entity
  }
}
