const { routes, views } = require('../../../constants/owner')
const { getOwner } = require('../../../session/register/owner')
const ViewModel = require('../../../models/register/owner/summary')
const schema = require('../../../schema/portal/owner')
const { addPerson } = require('../../../api/dda-index-api/person')

module.exports = [
  {
    method: 'GET',
    path: routes.summary.get,
    options: {
      handler: async (request, h) => {
        const owner = getOwner(request)

        const { error } = schema.validate(owner, { abortEarly: false })

        return h.view(views.summary, new ViewModel(owner, error))
      }
    }
  },
  {
    method: 'POST',
    path: routes.summary.post,
    options: {
      handler: async (request, h) => {
        const owner = getOwner(request)

        const { error } = schema.validate(owner, { abortEarly: false })

        if (error) {
          return h.view(views.summary, new ViewModel(owner, error)).code(400).takeover()
        }

        const person = {
          title: owner.name.title,
          first_name: owner.name.firstName,
          last_name: owner.name.lastName,
          address: {
            address_line_1: owner.address.addressLine1,
            address_line_2: owner.address.addressLine2,
            postcode: owner.address.postcode,
            county: owner.address.county,
            country: owner.address.country
          },
          contacts: [
            {
              contact: owner.email,
              type: 'email'
            },
            {
              contact: owner.phoneNumber,
              type: 'phone'
            }
          ]
        }

        const reference = await addPerson(person)

        request.yar.reset()

        request.yar.set('person-registration-number', reference)

        return h.redirect(routes.confirmation.get)
      }
    }
  }
]
