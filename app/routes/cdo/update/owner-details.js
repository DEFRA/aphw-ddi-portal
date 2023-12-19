const { routes, views } = require('../../../constants/owner')
const { admin } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/update/owner-details')
const { getPersonByReference, updatePerson } = require('../../../api/ddi-index-api/person')
const { getCountries } = require('../../../api/ddi-index-api')
const { addDateComponents } = require('../../../lib/date-helpers')
const { validatePayload } = require('../../../schema/portal/cdo/update/owner-details')
const { buildPersonUpdatePayload } = require('../../../lib/payload-builders')

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

        person['dateOfBirth'] = person['birthDate']

        addDateComponents(person, 'dateOfBirth')

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
          console.log(error)
          return h.view(views.updateDetails, new ViewModel(person, countries, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const person = request.payload

        const payload = buildPersonUpdatePayload(person)

        await updatePerson(payload)

        return h.redirect('/')
      }
    }
  }
]
