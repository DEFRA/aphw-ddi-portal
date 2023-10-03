const routes = [].concat(
  require('../routes/assets'),
  require('../routes/index'),
  require('../routes/register/owner/name'),
  require('../routes/register/owner/address'),
  require('../routes/register/owner/is-keeper'),
  require('../routes/register/owner/summary'),
  require('../routes/healthy'),
  require('../routes/healthz')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
