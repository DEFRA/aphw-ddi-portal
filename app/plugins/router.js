const routes = [].concat(
  require('../routes/assets'),
  require('../routes/index'),
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
