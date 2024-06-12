const { routes, views } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const { getOrphanedOwners, bulkDeletePersons } = require('../../../api/ddi-index-api/persons')
const { handleCheckboxSort } = require('./dogs-route-helper')
const { orphanedOwnersQuerySchema, orphanedOwnersPayloadSchema } = require('../../../schema/portal/admin/delete/owners')
const { initialiseOwnersForDeletion, getOrphanedOwnersForDeletion, setOrphanedOwnersForDeletion } = require('../../../session/admin/delete-owners')
const { SelectOwnersViewModel } = require('../../../models/admin/delete/owners')
const { ConfirmViewModel, OwnersRemovedViewModel } = require('../../../models/admin/delete/confirm')
const { addBackNavigation } = require('../../../lib/back-helpers')
const { getUser } = require('../../../auth')

module.exports = [
  {
    method: 'GET',
    path: `${routes.deleteOwners.get}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        query: orphanedOwnersQuerySchema,
        failAction: async (_, h) => {
          return h.response().code(404).takeover()
        }
      },
      handler: async (request, h) => {
        const { sortKey, sortOrder, start } = request.query
        const sort = { column: sortKey, order: sortOrder }

        const owners = await getOrphanedOwners({ sortKey, sortOrder })

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
        payload: orphanedOwnersPayloadSchema,
        failAction: async (_, h, errors) => {
          console.error(errors)
          return h.response().code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const payload = request.payload
        const ownersForDeletion = payload.deleteOwner

        const backNav = addBackNavigation(request)
        backNav.backLink = routes.deleteOwners.get

        if (!payload.confirm) {
          setOrphanedOwnersForDeletion(request, ownersForDeletion)
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
  }
  // {
  //   method: 'POST',
  //   path: `${routes.deleteDogsConfirm.post}`,
  //   options: {
  //     auth: { scope: [admin] },
  //     handler: async (request, h) => {
  //       const combinedSelectedList = getCombinedSelectedList(request)
  //       const totalCount = combinedSelectedList.length
  //
  //       const res = await bulkDeleteDogs(combinedSelectedList, getUser(request))
  //
  //       if (res?.count?.success !== totalCount) {
  //         throw new Error(`Bulk dog delete - the following records were not deleted: ${res?.deleted?.failed}`)
  //       }
  //
  //       setDogsForDeletion(request, 1, [])
  //       setDogsForDeletion(request, 2, [])
  //
  //       return h.view(views.success, DogsRemovedViewModel(totalCount))
  //     }
  //   }
  // }
]
