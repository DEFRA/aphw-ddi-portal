const { routes, views } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const { getOrphanedOwners, bulkDeletePersons } = require('../../../api/ddi-index-api/persons')
const { orphanedOwnersQuerySchema, orphanedOwnersPayloadSchema } = require('../../../schema/portal/admin/delete/owners')
const { initialiseOwnersForDeletion, getOrphanedOwnersForDeletion, setOrphanedOwnersForDeletion } = require('../../../session/admin/delete-owners')
const { SelectOwnersViewModel } = require('../../../models/admin/delete/owners')
const { ConfirmViewModel, OwnersRemovedViewModel } = require('../../../models/admin/delete/confirm')
const { addBackNavigation } = require('../../../lib/back-helpers')
const { getUser } = require('../../../auth')
const { handleCheckboxSort, getCheckboxSortQueryString } = require('./owners-route-helper')

module.exports = [
  {
    method: 'GET',
    path: `${routes.deleteOwners.get}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        query: orphanedOwnersQuerySchema
      },
      handler: async (request, h) => {
        const { sortKey, sortOrder, start } = request.query
        const sort = { column: sortKey, order: sortOrder }

        const owners = await getOrphanedOwners({
          sortKey: sortKey === 'selected' ? 'owner' : sortKey,
          sortOrder
        })

        if (start === true) {
          initialiseOwnersForDeletion(request, owners)
        }

        const selectedList = getOrphanedOwnersForDeletion(request)

        const localSortOwners = handleCheckboxSort(request, owners, selectedList)

        return h.view(views.deleteOwners, new SelectOwnersViewModel(localSortOwners, selectedList, sort, null))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.deleteOwners.post}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: orphanedOwnersPayloadSchema
      }
    },
    handler: async (request, h) => {
      const payload = request.payload
      const ownersForDeletion = payload.deleteOwner

      if (!payload.confirm) {
        setOrphanedOwnersForDeletion(request, ownersForDeletion)
      }

      if (request.payload.checkboxSortCol) {
        return h.redirect(`${routes.deleteOwners.get}${getCheckboxSortQueryString(request)}`)
      }

      const backNav = addBackNavigation(request)
      backNav.backLink = routes.deleteOwners.get

      if (!payload.confirm) {
        return h.view(views.deleteOwnersConfirm, new ConfirmViewModel(ownersForDeletion, backNav))
      }
      const totalCount = getOrphanedOwnersForDeletion(request).length

      const res = await bulkDeletePersons(ownersForDeletion, getUser(request))

      if (res?.count?.success !== totalCount) {
        throw new Error(`Bulk person delete - the following records were not deleted: ${res?.deleted?.failed}`)
      }

      setOrphanedOwnersForDeletion(request, [])

      return h.view(views.success, OwnersRemovedViewModel(res.count.success))
    }
  }
]
