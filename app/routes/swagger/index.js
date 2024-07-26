const { getDocumentation } = require('../../api/ddi-index-api/documentation')
const { getEnvironmentVariable } = require('../../lib/environment-helpers')
const { admin } = require('../../auth/permissions')

module.exports = [{
  method: 'GET',
  path: '/swagger.json',
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const allowedEnvironments = ['dev', 'snd', 'local']
      if (!allowedEnvironments.includes(getEnvironmentVariable('ENVIRONMENT_CODE'))) {
        return h.view('404').code(404)
      }

      const payload = await getDocumentation()
      return h.response(payload).code(200)
    }
  }
}
]
