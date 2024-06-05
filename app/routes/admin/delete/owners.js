const { routes, views } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
// const { getUser } = require('../../../auth')
// const { deleteDogsQuerySchema1, deleteDogsQuerySchema2 } = require('../../../schema/portal/admin/delete/dogs')
// const { ConfirmViewModel, DogsRemovedViewModel } = require('../../../models/admin/delete/confirm')
// const { ViewModel: SelectViewModel } = require('../../../models/admin/delete/dogs')
const { getOrphanedOwners } = require('../../../api/ddi-index-api/persons')
// const { initialiseDogsForDeletion, setDogsForDeletion, getDogsForDeletion } = require('../../../session/admin/delete-dogs')
// const { getCombinedSelectedList, getDateOverrideQueryString, getCheckboxSortQueryString, handleCheckboxSort } = require('./dogs-route-helper')
const { handleCheckboxSort } = require('./dogs-route-helper')
const { orphanedOwnersQuerySchema } = require('../../../schema/portal/admin/delete/owners')
const { initialiseOwnersForDeletion, getOrphanedOwnersForDeletion } = require('../../../session/admin/delete-owners')
// const { DeleteOwnersViewModel, SelectOwnersViewModel } = require('../../../models/admin/delete/owners')
const { SelectOwnersViewModel } = require('../../../models/admin/delete/owners')

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
  }
  // {
  //   method: 'POST',
  //   path: `${routes.deleteDogs1.post}`,
  //   options: {
  //     auth: { scope: [admin] },
  //     handler: async (request, h) => {
  //       const payload = request.payload
  //
  //       setDogsForDeletion(request, 1, payload?.deleteDog)
  //
  //       if (payload?.checkboxSortOnly === 'Y') {
  //         return h.redirect(`${routes.deleteDogs1.get}${getDateOverrideQueryString(request)}${getCheckboxSortQueryString(request)}`)
  //       }
  //
  //       return h.redirect(`${routes.deleteDogs2.get}${getDateOverrideQueryString(request)}`)
  //     }
  //   }
  // },
  // {
  //   method: 'GET',
  //   path: `${routes.deleteDogs2.get}`,
  //   options: {
  //     auth: { scope: [admin] },
  //     validate: {
  //       query: deleteDogsQuerySchema2,
  //       failAction: async (_, h) => {
  //         return h.response().code(404).takeover()
  //       }
  //     },
  //     handler: async (request, h) => {
  //       const params = request.query
  //
  //       const sort = { column: params.sortKey, order: params.sortOrder }
  //
  //       const dogs = await getOldDogs(statusListForStep2, sort, params.today)
  //
  //       const backNav = { backLink: routes.deleteDogs1.get }
  //
  //       const selectedList = getDogsForDeletion(request, 2)
  //
  //       const localSortDogs = handleCheckboxSort(request, dogs, selectedList)
  //
  //       return h.view(views.deleteDogs2, new SelectViewModel(localSortDogs, selectedList, sort, backNav))
  //     }
  //   }
  // },
  // {
  //   method: 'POST',
  //   path: `${routes.deleteDogs2.post}`,
  //   options: {
  //     auth: { scope: [admin] },
  //     handler: async (request, h) => {
  //       const payload = request.payload
  //
  //       setDogsForDeletion(request, 2, payload?.deleteDog)
  //
  //       if (payload?.checkboxSortOnly === 'Y') {
  //         return h.redirect(`${routes.deleteDogs2.get}${getDateOverrideQueryString(request)}${getCheckboxSortQueryString(request)}`)
  //       }
  //
  //       return h.redirect(routes.deleteDogsConfirm.get)
  //     }
  //   }
  // },
  // {
  //   method: 'GET',
  //   path: `${routes.deleteDogsConfirm.get}`,
  //   options: {
  //     auth: { scope: [admin] },
  //     handler: async (request, h) => {
  //       const backNav = { backLink: routes.deleteDogs2.get }
  //
  //       const combinedSelectedList = getCombinedSelectedList(request)
  //
  //       return h.view(views.deleteDogsConfirm, new ConfirmViewModel(combinedSelectedList, backNav))
  //     }
  //   }
  // },
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
