const { routes, views } = require('../../../../constants/admin')
const { admin } = require('../../../../auth/permissions')
const UserListModel = require('../../../../models/admin/users/police/user-list')
const { getUsers } = require('../../../../api/ddi-index-api/users')
const { getUser } = require('../../../../auth')
const { getPoliceForces } = require('../../../../api/ddi-index-api/police-forces')
const { policeOfficerListQuerySchema } = require('../../../../schema/portal/admin/users')
const { sort } = require('../../../../constants/api')

const getSortOrder = (key, order) => {
  if (key === 'indexAccess') {
    return order !== sort.DESC
  }

  if (order === sort.DESC) {
    return sort.DESC
  }

  return sort.ASC
}

/**
 * @param {'email'|'policeForce'|'indexAccess'} key
 * @param order
 * @return {GetUserOptions['sort']}
 */
const getSortOptions = (key, order) => {
  if (key === 'email') {
    return {
      username: getSortOrder('username', order)
    }
  }
  return {
    [key]: getSortOrder(key, order)
  }
}

const getSortColumns = (column, order) => {
  return {
    order: getSortOrder(column, order),
    column: column ?? 'email'
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.policeUserList.get}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        query: policeOfficerListQuerySchema
      }
    },
    handler: async (request, h) => {
      const backLink = routes.index
      const { policeForce, sortKey, sortOrder } = request.query.policeForce
      /**
       * @type {GetUserOptions}
       */
      const getUserOptions = {}

      /**
       * Only filter by policeForceId if policeForce is a natural number
       */
      if (!isNaN(parseInt(policeForce)) && policeForce > 0) {
        getUserOptions.filter = {
          policeForceId: policeForce
        }
      }

      if (sortKey !== undefined) {
        getUserOptions.sort = getSortOptions(sortKey, sortOrder)
      }

      const user = getUser(request)
      const { users, count } = await getUsers(getUserOptions, user)

      const policeForces = await getPoliceForces(user)

      const sort = getSortColumns(sortKey, sortOrder)

      return h.view(views.userList, new UserListModel({ users, count, policeForces, policeForce, sort }, {}, backLink))
    }
  }
]
