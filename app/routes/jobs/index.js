const jobsConstants = require('../../constants/jobs')
const { admin } = require('../../auth/permissions')
const { purgeSoftDelete, neuteringDeadline } = require('../../api/ddi-index-api/jobs')
const getUser = require('../../auth/get-user')

module.exports = [
  {
    method: 'GET',
    path: jobsConstants.routes.purgeSoftDelete.get,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        console.log('~~~~~~ Chris Debug ~~~~~~ purge soft delete', '')
        const user = getUser(request)
        const res = await purgeSoftDelete(user, request.query.today)
        return h.response(res).code(200)
      }
    }
  },
  {
    method: 'GET',
    path: jobsConstants.routes.neuteringDeadline.get,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        console.log('~~~~~~ Chris Debug ~~~~~~ neutering deadline', '')
        const res = await neuteringDeadline(request.query.today, getUser(request))
        return h.response(res).code(200)
      }
    }
  }
]
