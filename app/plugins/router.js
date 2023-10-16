const routes = [].concat(
  require('../routes/assets'),
  require('../routes/index'),
  require('../routes/register/owner/name'),
  require('../routes/register/owner/postcode'),
  require('../routes/register/owner/select-address'),
  require('../routes/register/owner/address'),
  require('../routes/register/owner/email'),
  require('../routes/register/owner/phone-number'),
  require('../routes/register/owner/date-of-birth'),
  require('../routes/register/owner/summary'),
  require('../routes/register/owner/confirmation'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/view-registration')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
