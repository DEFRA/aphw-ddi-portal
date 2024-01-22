const routes = [].concat(
  require('../routes/assets'),
  require('../routes/index'),
  require('../routes/cdo/create/owner-details'),
  require('../routes/cdo/create/select-address'),
  require('../routes/cdo/create/address'),
  require('../routes/cdo/create/enforcement-details'),
  require('../routes/cdo/create/owner-summary'),
  require('../routes/cdo/create/dog-details'),
  require('../routes/cdo/create/confirm-dog-details'),
  require('../routes/cdo/search/basic'),
  require('../routes/cdo/create/confirm-dog-delete'),
  require('../routes/cdo/create/record-created'),
  require('../routes/cdo/edit/dog-details'),
  require('../routes/cdo/view/dog-details'),
  require('../routes/cdo/edit/owner-details'),
  require('../routes/cdo/view/owner-details'),
  require('../routes/cdo/view/certificate'),
  require('../routes/cdo/edit/exemption-details'),
  require('../routes/cdo/edit/change-status'),
  require('../routes/cdo/edit/change-status-confirmation'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/cookies'),
  require('../routes/view-registration'),
  require('../routes/authenticate'),
  require('../routes/login'),
  require('../routes/logout'),
  require('../routes/dev-auth'),
  require('../routes/upload/register/upload-register'),
  require('../routes/export/export-data')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
