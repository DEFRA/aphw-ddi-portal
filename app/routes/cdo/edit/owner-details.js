const { routes, views } = require('../../../constants/owner')
const { admin } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/owner-details')
const { getPersonByReference, updatePerson } = require('../../../api/ddi-index-api/person')
const { getCountries } = require('../../../api/ddi-index-api')
const { addDateComponents } = require('../../../lib/date-helpers')
const { validatePayload } = require('../../../schema/portal/edit/owner-details')
const { buildPersonUpdatePayload } = require('../../../lib/payload-builders')
const { addBackNavigation } = require('../../../lib/back-helpers')

module.exports = [
  {
    method: 'GET',
    path: `${routes.editDetails.get}/{personReference}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const person = await getPersonByReference(request.params.personReference)

        if (person == null) {
          return h.response().code(404).takeover()
        }

        person.dateOfBirth = person.birthDate

        addDateComponents(person, 'dateOfBirth')

        const countries = await getCountries()

        const backNav = addBackNavigation(request)

        return h.view(views.editDetails, new ViewModel(person, countries, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.editDetails.post}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const person = request.payload
          const countries = await getCountries()

          const backNav = addBackNavigation(request)

          return h.view(views.editDetails, new ViewModel(person, countries, backNav, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const person = request.payload

        const payload = buildPersonUpdatePayload(person)

        await updatePerson(payload)

        return h.redirect(`${routes.viewOwnerDetails.get}/${person.personReference}`)
      }
    }
  }
]
