const { admin } = require('../auth/permissions')
const { send } = require('../event')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      await send('123', { message: 'test' })
      return h.view('index')
    }
  }
}
