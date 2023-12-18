const { routes, views } = require('../../../constants/owner')
const { admin } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/update/owner-details')
const { getPersonByReference } = require('../../../api/ddi-index-api/person')
const { getCountries } = require('../../../api/ddi-index-api')
const { addDateComponents } = require('../../../lib/date-helpers')
const { validatePayload } = require('../../../schema/portal/cdo/update/owner-details')

module.exports = [
  {
    method: 'GET',
    path: `${routes.updateDetails.get}/{personReference}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const person = await getPersonByReference(request.params.personReference)

        if (person === undefined) {
          return h.response().code(404).takeover()
        }

        addDateComponents(person, 'birthDate')

        const countries = await getCountries()

        return h.view(views.updateDetails, new ViewModel(person, countries))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.updateDetails.post}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const person = request.payload
          const countries = await getCountries()
          return h.view(views.updateDetails, new ViewModel(person, countries, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        return h.redirect('/')
      }
    }
  }
]
