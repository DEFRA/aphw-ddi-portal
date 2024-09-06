const { admin } = require('../../auth/permissions')
const { formatToDateTime } = require('../../lib/date-helpers')
const { prepopCodes } = require('../../api/ddi-index-api/prepop-codes')

module.exports = [
  {
    method: 'GET',
    path: '/admin/prepop-codes',
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        prepopCodes()

        return h.response(`Triggered code pre-population at ${formatToDateTime(new Date())}`)
      }
    }
  }
]
