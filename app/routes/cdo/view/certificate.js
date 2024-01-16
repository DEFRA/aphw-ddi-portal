const Joi = require('joi')
const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/certificate')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { addBackNavigation } = require('../../../lib/back-helpers')

module.exports = [
  {
    method: 'GET',
    path: `${routes.certificate.get}/{indexNumber}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const cdo = await getCdo(request.params.indexNumber)

        if (cdo === undefined) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request)

        return h.view(views.certificate, new ViewModel(cdo.dog.indexNumber, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.certificate.post}`,
    options: {
      validate: {
        payload: Joi.object({
          indexNumber: Joi.string().required()
        }),
        failAction: async (request, h, error) => {
          return h.response().code(400).takeover()
        }
      },
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const cdo = await getCdo(request.payload.indexNumber)

        if (cdo === undefined) {
          return h.response().code(400).takeover()
        }

        const backNav = addBackNavigation(request)

        return h.view(views.certificate, new ViewModel(cdo, backNav))
      }
    }
  }
]
