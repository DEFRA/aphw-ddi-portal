const routes = [].concat(
  require('../routes/assets'),
  require('../routes/index'),
  require('../routes/register/owner/name'),
  require('../routes/register/owner/address'),
  require('../routes/register/owner/is-keeper'),
  require('../routes/register/owner/summary'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/view-registration'),
  require('../routes/capture-test'),
  require('../routes/authenticate'),
  require('../routes/login'),
  require('../routes/logout'),
  require('../routes/dev-auth')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
