const { routes, views, keys } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/create/dog-details')
const { getDog, setDog } = require('../../../session/cdo/dog')
const { getBreeds } = require('../../../api/ddi-index-api')
const { addMonths } = require('date-fns')
const { UTCDate } = require('@date-fns/utc')
const Joi = require('joi')
const dogDetailsSchema = require('../../../schema/portal/cdo/dog-details')
const { dateComponentsToString, addDateComponents, removeDateComponents } = require('../../../lib/date-helpers')

const validatePayload = (payload) => {
  payload.cdoIssued = dateComponentsToString(payload, 'cdoIssued')

  payload.cdoExpiry = addMonths(new UTCDate(payload.cdoIssued), 2)

  const schema = Joi.object({
    'cdoIssued-day': Joi.number().required().messages({
      'any.required': 'CDO issue date must include a valid day',
      'number.empty': 'CDO issue date must include a valid day',
      'number.base': 'CDO issue date must include a valid day'
    }),
    'cdoIssued-month': Joi.number().required().messages({
      'any.required': 'CDO issue date must include a valid month',
      'number.empty': 'CDO issue date must include a valid month',
      'number.base': 'CDO issue date must include a valid month'
    }),
    'cdoIssued-year': Joi.number().required().messages({
      'any.required': 'CDO issue date must include a valid year',
      'number.empty': 'CDO issue date must include a valid year',
      'number.base': 'CDO issue date must include a valid year'
    }),
    dogId: Joi.number().optional()
  }).concat(dogDetailsSchema)

  const { value, error } = schema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.details.get}/{dogId?}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const dog = getDog(request)

        if (dog === undefined) {
          return h.response().code(404).takeover()
        }

        dog.id = request.params.dogId

        const { breeds } = await getBreeds()

        if (dog[keys.cdoIssued] !== undefined) {
          addDateComponents(dog, keys.cdoIssued)
        }

        return h.view(views.details, new ViewModel(dog, breeds))
      }
    }
  },
  {
    method: 'POST',
    path: routes.details.post,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const dog = request.payload
          const { breeds } = await getBreeds()
          return h.view(views.details, new ViewModel(dog, breeds, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const dog = request.payload

        removeDateComponents(dog, 'cdoIssued')

        try {
          setDog(request, dog)
        } catch (error) {
          if (error.type === 'DOG_NOT_FOUND') {
            return h.response().code(400).takeover()
          }

          throw error
        }

        return h.redirect(routes.confirm.get)
      }
    }
  }
]
