const { views } = require('../constants/admin')
const { getEnvironmentVariable } = require('../lib/environment-helpers')
const { admin } = require('../auth/permissions')
const { documentation } = require('../constants/admin')

module.exports = {
  method: 'GET',
  path: '/documentation',
  options: {
    auth: { scope: [admin] },
    handler: async (_, h) => {
      console.log('~~~~~~ Chris Debug ~~~~~~ documentation reached', '')
      if (!documentation.allowedEnvironments.includes(getEnvironmentVariable('ENVIRONMENT_CODE'))) {
        return h.view('404').code(404)
      }

      return h.view(views.documentation)
    }
  }
}
