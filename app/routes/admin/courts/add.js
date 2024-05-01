const { routes, views } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/common/single-submit')

module.exports = [
  {
    method: 'GET',
    path: `${routes.addCourt.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const backLink = routes.courts.get

        return h.view(views.addAdminRecord, new ViewModel({
          backLink,
          recordTypeText: 'court',
          recordType: 'court',
          action: 'add',
          buttonText: 'Add court'
        }))
      }
    }
  }
  // {
  //   method: 'POST',
  //   path: `${routes.courts.post}`,
  //   options: {
  //     auth: { scope: [admin] },
  //     validate: {
  //       payload: validatePayload,
  //       failAction: async (request, h, error) => {
  //         return h.view(views.addOrRemove, new ViewModel({
  //           recordTypeText: 'court',
  //           recordType: 'court'
  //         }, undefined, error)).code(400).takeover()
  //       }
  //     },
  //     handler: async (request, h) => {
  //       const addRemoveCourt = request.payload.addOrRemove
  //       let redirectUrl
  //
  //       if (addRemoveCourt === 'remove') {
  //         redirectUrl = routes.removeCourt.get
  //       } else {
  //         redirectUrl = routes.addCourt.get
  //       }
  //
  //       return h.redirect(redirectUrl)
  //     }
  //   }
  // }
]
