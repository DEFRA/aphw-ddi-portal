const routes = [].concat(
  require('../routes/assets'),
  require('../routes/index'),
  require('../routes/cdo/create/owner-details'),
  require('../routes/cdo/create/select-owner'),
  require('../routes/cdo/create/postcode-lookup'),
  require('../routes/cdo/create/select-address'),
  require('../routes/cdo/create/address'),
  require('../routes/cdo/create/application-type'),
  require('../routes/cdo/create/enforcement-details'),
  require('../routes/cdo/create/full-summary'),
  require('../routes/cdo/create/dog-details'),
  require('../routes/cdo/create/confirm-dog-details'),
  require('../routes/cdo/create/microchip-search'),
  require('../routes/cdo/create/microchip-results'),
  require('../routes/cdo/search/basic'),
  require('../routes/cdo/create/confirm-dog-delete'),
  require('../routes/cdo/create/record-created'),
  require('../routes/cdo/edit/dog-details'),
  require('../routes/cdo/view/dog-details'),
  require('../routes/cdo/view/check-activities'),
  require('../routes/cdo/edit/owner-details'),
  require('../routes/cdo/view/owner-details'),
  require('../routes/cdo/view/certificate'),
  require('../routes/cdo/edit/exemption-details'),
  require('../routes/cdo/edit/change-status'),
  require('../routes/cdo/edit/change-status-confirmation'),
  require('../routes/cdo/edit/add-activity'),
  require('../routes/cdo/edit/select-activity'),
  require('../routes/cdo/edit/activity-confirmation'),
  require('../routes/cdo/edit/postcode-lookup'),
  require('../routes/cdo/edit/select-address'),
  require('../routes/cdo/edit/address'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/cookies'),
  require('../routes/view-registration'),
  require('../routes/authenticate'),
  require('../routes/login'),
  require('../routes/logout'),
  require('../routes/dev-auth'),
  require('../routes/upload/register/upload-register'),
  require('../routes/export/export-data'),
  require('../routes/admin/regular-jobs')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
