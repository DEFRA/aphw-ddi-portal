const { routes, views } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const { getUser } = require('../../../auth')
const { deleteDogsQuerySchema1, deleteDogsQuerySchema2 } = require('../../../schema/portal/admin/delete/dogs')
const { ConfirmViewModel, DogsRemovedViewModel } = require('../../../models/admin/delete/confirm')
const { ViewModel: SelectViewModel } = require('../../../models/admin/delete/dogs')
const { getOldDogs, bulkDeleteDogs } = require('../../../api/ddi-index-api/dogs')
const { initialiseDogsForDeletion, setDogsForDeletion, getDogsForDeletion } = require('../../../session/admin/delete-dogs')
const { getCombinedSelectedList, getDateOverrideQueryString, getCheckboxSortQueryString, handleCheckboxSort } = require('./dogs-route-helper')
const { addBackNavigation } = require('../../../lib/back-helpers')

const statusListForStep1 = 'Exempt,Inactive,Withdrawn,Failed'
const statusListForStep2 = 'In breach,Pre-exempt,Interim exempt'

module.exports = [
  {
    method: 'GET',
    path: `${routes.deleteDogs1.get}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        query: deleteDogsQuerySchema1,
        failAction: async (_, h) => {
          return h.response().code(404).takeover()
        }
      },
      handler: async (request, h) => {
        const params = request.query
        const user = getUser(request)

        const sort = { column: params.sortKey, order: params.sortOrder }

        const dogs = await getOldDogs(user, statusListForStep1, sort, params.today)

        if (params.start === 'true') {
          initialiseDogsForDeletion(request, dogs)
          return h.redirect(`${routes.deleteDogs1.get}${getDateOverrideQueryString(request)}`)
        }

        const selectedList = getDogsForDeletion(request, 1)

        const localSortDogs = handleCheckboxSort(request, dogs, selectedList)

        const backNav = addBackNavigation(request)
        backNav.backLink = '/'

        return h.view(views.deleteDogs1, new SelectViewModel(localSortDogs, selectedList, sort, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.deleteDogs1.post}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const payload = request.payload

        setDogsForDeletion(request, 1, payload?.deleteDog)

        if (payload?.checkboxSortCol) {
          return h.redirect(`${routes.deleteDogs1.get}${getDateOverrideQueryString(request)}${getCheckboxSortQueryString(request)}`)
        }

        if (payload?.followLink) {
          return h.redirect(`/cdo/view/dog-details/${payload?.followLink}?src=${payload?.srcHashParam}`)
        }

        return h.redirect(`${routes.deleteDogs2.get}${getDateOverrideQueryString(request)}`)
      }
    }
  },
  {
    method: 'GET',
    path: `${routes.deleteDogs2.get}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        query: deleteDogsQuerySchema2,
        failAction: async (_, h) => {
          return h.response().code(404).takeover()
        }
      },
      handler: async (request, h) => {
        const params = request.query
        const user = getUser(request)

        const sort = { column: params.sortKey, order: params.sortOrder }

        const dogs = await getOldDogs(user, statusListForStep2, sort, params.today)

        const backNav = addBackNavigation(request)
        backNav.backLink = routes.deleteDogs1.get

        const selectedList = getDogsForDeletion(request, 2)

        const localSortDogs = handleCheckboxSort(request, dogs, selectedList)

        return h.view(views.deleteDogs2, new SelectViewModel(localSortDogs, selectedList, sort, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.deleteDogs2.post}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const payload = request.payload

        setDogsForDeletion(request, 2, payload?.deleteDog)

        if (payload?.checkboxSortCol) {
          return h.redirect(`${routes.deleteDogs2.get}${getDateOverrideQueryString(request)}${getCheckboxSortQueryString(request)}`)
        }

        if (payload?.followLink) {
          return h.redirect(`/cdo/view/dog-details/${payload?.followLink}?src=${payload?.srcHashParam}`)
        }

        return h.redirect(routes.deleteDogsConfirm.get)
      }
    }
  },
  {
    method: 'GET',
    path: `${routes.deleteDogsConfirm.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const backNav = { backLink: routes.deleteDogs2.get }

        const combinedSelectedList = getCombinedSelectedList(request)

        return h.view(views.deleteDogsConfirm, new ConfirmViewModel(combinedSelectedList, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.deleteDogsConfirm.post}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const combinedSelectedList = getCombinedSelectedList(request)
        const totalCount = combinedSelectedList.length

        const res = await bulkDeleteDogs(combinedSelectedList, getUser(request))

        if (res?.count?.success !== totalCount) {
          throw new Error(`Bulk dog delete - the following records were not deleted: ${res?.deleted?.failed}`)
        }

        setDogsForDeletion(request, 1, [])
        setDogsForDeletion(request, 2, [])

        return h.view(views.success, DogsRemovedViewModel(totalCount))
      }
    }
  }
]
