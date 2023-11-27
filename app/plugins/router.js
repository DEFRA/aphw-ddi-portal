const routes = [].concat(
  require('../routes/assets'),
  require('../routes/index'),
  require('../routes/register/owner/owner-details'),
  require('../routes/register/owner/select-address'),
  require('../routes/register/owner/address'),
  require('../routes/register/owner/email'),
  require('../routes/register/owner/phone-number'),
  require('../routes/register/owner/summary'),
  require('../routes/register/owner/confirmation'),
  require('../routes/healthy'),
  require('../routes/healthz'),
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
