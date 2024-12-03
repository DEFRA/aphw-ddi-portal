const routes = [].concat(
  require('../routes/assets'),
  require('../routes/index'),
  require('../routes/accessibility'),
  require('../routes/cdo/create/owner-details'),
  require('../routes/cdo/create/select-owner'),
  require('../routes/cdo/create/postcode-lookup'),
  require('../routes/cdo/create/select-address'),
  require('../routes/cdo/create/address'),
  require('../routes/cdo/create/application-type'),
  require('../routes/cdo/create/enforcement-details'),
  require('../routes/cdo/create/full-summary'),
  require('../routes/cdo/create/dog-details'),
  require('../routes/cdo/create/select-existing-dog'),
  require('../routes/cdo/create/confirm-dog-details'),
  require('../routes/cdo/create/microchip-search'),
  require('../routes/cdo/create/microchip-results'),
  require('../routes/cdo/create/microchip-results-stop'),
  require('../routes/cdo/search/basic'),
  require('../routes/cdo/create/confirm-dog-delete'),
  require('../routes/cdo/create/record-created'),
  require('../routes/cdo/edit/dog-details'),
  require('../routes/cdo/view/dog-details'),
  require('../routes/cdo/view/check-history'),
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
  require('../routes/cdo/edit/police-force-changed'),
  require('../routes/cdo/edit/police-force-not-found'),
  require('../routes/cdo/edit/country-changed'),
  require('../routes/cdo/edit/country-changed-info'),
  require('../routes/cdo/delete/owner'),
  require('../routes/cdo/delete/dog'),
  require('../routes/cdo/manage/live'),
  require('../routes/cdo/manage/cdo'),
  require('../routes/cdo/manage/tasks/generic-task'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/cookies'),
  require('../routes/authenticate'),
  require('../routes/login'),
  require('../routes/logout'),
  require('../routes/dev-auth'),
  require('../routes/upload/import-xlb'),
  require('../routes/upload/import-validation'),
  require('../routes/upload/import-results'),
  require('../routes/upload/import-completed'),
  require('../routes/export/export-data'),
  require('../routes/admin/index'),
  require('../routes/admin/regular-jobs'),
  require('../routes/admin/statistics'),
  require('../routes/admin/pseudonyms'),
  require('../routes/admin/insurance'),
  require('../routes/admin/courts/index'),
  require('../routes/admin/courts/add'),
  require('../routes/admin/courts/remove'),
  require('../routes/admin/activities/index'),
  require('../routes/admin/activities/add'),
  require('../routes/admin/activities/remove'),
  require('../routes/admin/police/index'),
  require('../routes/admin/police/add'),
  require('../routes/admin/police/remove'),
  require('../routes/admin/delete/dogs'),
  require('../routes/admin/delete/owners'),
  require('../routes/admin/users/police/index'),
  require('../routes/admin/users/police/add'),
  require('../routes/admin/users/police/remove'),
  require('../routes/admin/users/police/list.js'),
  require('../routes/admin/external-events'),
  require('../routes/admin/audit/audit-query-type'),
  require('../routes/admin/audit/audit-query-details'),
  require('../routes/jobs'),
  require('../routes/swagger'),
  require('../routes/documentation')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
