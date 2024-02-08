const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/select-activity')

module.exports = [
  {
    method: 'GET',
    path: `${routes.selectActivityConfirmation.get}/{indexNumber}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        // TODO - get last activity saved for dog record - possible collision with other users so perhaps pass a PK in url
        const model = {
          indexNumber: request.params.indexNumber,
          message: 'Activity \'witness statement received\' has been recorded'
        }

        return h.view(views.selectActivityConfirmation, new ViewModel(model))
      }
    }
  }
]
