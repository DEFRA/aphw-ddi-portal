const { routes, views } = require('../../../constants/cdo/owner')
const ViewModel = require('../../../models/common/confim')
const { validatePayload } = require('../../../schema/portal/common/confirm')
const { admin } = require('../../../auth/permissions')
const getUser = require('../../../auth/get-user')
const { addBackNavigation, addBackNavigationForErrorCondition, extractBackNavParam } = require('../../../lib/back-helpers')
const { getPersonByReference, deletePerson } = require('../../../api/ddi-index-api/person')

module.exports = [{
  method: 'GET',
  path: `${routes.delete.get}/{pk?}`,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const pk = request.params.pk

      const user = getUser(request)
      const details = await buildDetails(pk, user)

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
        const user = getUser(request)
        const details = await buildDetails(payload.pk, user)

        const backNav = addBackNavigationForErrorCondition(request)

        return h.view(views.delete, new ViewModel(details, backNav, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const payload = request.payload

      if (payload.confirm === 'N') {
        return h.redirect(`${routes.viewOwnerDetails.get}/${payload.pk}${extractBackNavParam(request)}`)
      }

      const user = getUser(request)
      const details = await buildDetails(payload.pk, user)

      await deletePerson(payload.pk, user)

      return h.view(views.confirmation, new ViewModel(details))
    }
  }
}]

/**
 * @param pk
 * @param user
 * @return {Promise<{recordTypeText: string, nameOrReference: string, action: string, pk, nameOrReferenceText: string, confirmReferenceText: string}>}
 */
const buildDetails = async (pk, user) => {
  const entity = await getPersonByReference(pk, user)

  return {
    action: 'delete',
    pk,
    recordTypeText: 'the owner',
    nameOrReference: `${entity.firstName} ${entity.lastName}`,
    nameOrReferenceText: `for ${entity.firstName} ${entity.lastName}`,
    confirmReferenceText: `for ${entity.firstName} ${entity.lastName}`
  }
}
