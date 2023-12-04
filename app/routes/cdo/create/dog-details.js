const { routes, views, keys } = require('../../../constants/dog')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/create/dog-details')
const { getDog, setDog } = require('../../../session/cdo/dog')
const { getBreeds } = require('../../../api/ddi-index-api')
const { addMonths } = require('date-fns')
const { UTCDate } = require('@date-fns/utc')
const Joi = require('joi')
const dogDetailsSchema = require('../../../schema/portal/cdo/dog-details')

const dateComponentsToString = (payload, prefix) => {
  const year = payload[prefix + '-year']
  const month = payload[prefix + '-month']
  const day = payload[prefix + '-day']

  return `${year}-${month}-${day}`
}

const addDateComponents = (payload, key) => {
  const iso = payload[key]

  if (iso === undefined) {
    return iso
  }

  const date = new UTCDate(iso)

  payload[`${key}-year`] = date.getFullYear()
  payload[`${key}-month`] = date.getMonth() + 1
  payload[`${key}-day`] = date.getDate()
}

const removeDateComponents = (payload, prefix) => {
  delete payload[prefix + '-year']
  delete payload[prefix + '-month']
  delete payload[prefix + '-day']
}

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
    })
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
    path: routes.details.get,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const dog = getDog(request)

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

        setDog(request, dog)

        return h.redirect(routes.confirm.get)
      }
    }
  }
]
