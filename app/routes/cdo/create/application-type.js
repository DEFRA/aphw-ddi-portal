const { routes: dogRoutes, views, keys } = require('../../../constants/cdo/dog')
const { routes: ownerRoutes } = require('../../../constants/cdo/owner')
const { admin } = require('../../../auth/permissions')
const { addDateComponents, removeDateComponents } = require('../../../lib/date-helpers')
const ViewModel = require('../../../models/cdo/create/application-type')
const { getDog, setDog } = require('../../../session/cdo/dog')
const { setPoliceForce } = require('../../../lib/model-helpers')
const { validatePayload } = require('../../../schema/portal/cdo/application-type')

module.exports = [
  {
    method: 'GET',
    path: `${dogRoutes.applicationType.get}/{dogId?}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const dog = getDog(request)

        if (dog === undefined) {
          return h.response().code(404).takeover()
        }

        dog.dogId = request.params.dogId

        if (!dog[keys.interimExemption]) {
          dog[keys.interimExemption] = new Date()
        }

        if (dog[keys.interimExemption] !== undefined) {
          addDateComponents(dog, keys.interimExemption)
        }

        if (dog[keys.cdoIssued] !== undefined) {
          addDateComponents(dog, keys.cdoIssued)
        }

        return h.view(views.applicationType, new ViewModel(dog))
      }
    }
  },
  {
    method: 'POST',
    path: `${dogRoutes.applicationType.post}/{dummy?}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const dog = request.payload

          return h.view(views.applicationType, new ViewModel(dog, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const dog = { ...getDog(request), ...request.payload }

        removeDateComponents(dog, keys.interimExemption)
        removeDateComponents(dog, keys.cdoIssued)

        try {
          setDog(request, dog)
        } catch (error) {
          if (error.type === 'DOG_NOT_FOUND') {
            return h.response().code(400).takeover()
          }

          throw error
        }

        await setPoliceForce(request)

        return h.redirect(ownerRoutes.enforcementDetails.get)
      }
    }
  }
]
