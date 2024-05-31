const { routes, views } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const { getUser } = require('../../../auth')
const { ConfirmViewModel, DogsRemovedViewModel } = require('../../../models/admin/delete/confirm')
const { ViewModel: SelectViewModel } = require('../../../models/admin/delete/dogs')
const { getOldDogs, bulkDeleteDogs } = require('../../../api/ddi-index-api/dogs')
const { initialiseDogsForDeletion, setDogsForDeletion, getDogsForDeletion } = require('../../../session/admin/delete-dogs')

const getCombinedSelectedList = (request) => {
  return getDogsForDeletion(request, 1).concat(getDogsForDeletion(request, 2))
}

const getDateOverrideQueryString = request => {
  return request.query.today ? `?today=${request.query.today}` : ''
}

const statusListForStep1 = 'Exempt,Inactive,Withdrawn,Failed'
const statusListForStep2 = 'In breach,Pre-exempt,Interim exempt'

module.exports = [
  {
    method: 'GET',
    path: `${routes.deleteDogs1.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const sort = { column: 'status', order: 'ASC' }

        const dogs = await getOldDogs(statusListForStep1, sort, request.query.today)

        if (request.query.start === 'true') {
          initialiseDogsForDeletion(request, dogs)
          return h.redirect(`${routes.deleteDogs1.get}${getDateOverrideQueryString(request)}`)
        }

        const selectedList = getDogsForDeletion(request, 1)

        return h.view(views.deleteDogs1, new SelectViewModel(dogs, selectedList, sort, null))
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

        return h.redirect(`${routes.deleteDogs2.get}${getDateOverrideQueryString(request)}`)
      }
    }
  },
  {
    method: 'GET',
    path: `${routes.deleteDogs2.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const sort = { column: 'status', order: 'ASC' }

        const dogs = await getOldDogs(statusListForStep2, sort, request.query.today)

        const backNav = { backLink: routes.deleteDogs1.get }

        const selectedList = getDogsForDeletion(request, 2)

        return h.view(views.deleteDogs2, new SelectViewModel(dogs, selectedList, sort, backNav))
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
