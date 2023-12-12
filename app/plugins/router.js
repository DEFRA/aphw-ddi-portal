const routes = [].concat(
  require('../routes/assets'),
  require('../routes/index'),
  require('../routes/cdo/create/owner-details'),
  require('../routes/cdo/create/select-address'),
  require('../routes/cdo/create/address'),
  require('../routes/cdo/create/enforcement-details'),
  require('../routes/cdo/create/owner-summary'),
  require('../routes/cdo/create/confirmation'),
  require('../routes/cdo/create/dog-details'),
  require('../routes/cdo/create/confirm-dog-details'),
  require('../routes/cdo/create/confirm-dog-delete'),
  require('../routes/cdo/create/record-created'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/cookies'),
  require('../routes/view-registration'),
  require('../routes/authenticate'),
  require('../routes/login'),
  require('../routes/logout'),
  require('../routes/dev-auth'),
  require('../routes/upload/register/upload-register')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
