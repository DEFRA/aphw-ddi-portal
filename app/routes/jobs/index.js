const jobsConstants = require('../../constants/jobs')
const { admin } = require('../../auth/permissions')
const { purgeSoftDelete, neuteringDeadline } = require('../../api/ddi-index-api/jobs')

module.exports = [
  {
    method: 'GET',
    path: jobsConstants.routes.purgeSoftDelete.get,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const res = await purgeSoftDelete(request.query.today)
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
        const res = await neuteringDeadline(request.query.today)
        return h.response(res).code(200)
      }
    }
  }
]
