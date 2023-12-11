const Joi = require('joi')
const { startOfDay, parse, isAfter, isValid, differenceInYears } = require('date-fns')

const validate = (value, helper) => {
  const options = {
    locale: 'enGB'
  }

  const dob = `${value.dobYear || ''}-${value.dobMonth || ''}-${value.dobDay || ''}`

  // Allow DOB to be optional
  if (dob !== '--') {
    const today = startOfDay(new Date())
    const parsedDob = parse(dob, 'yyyy-MM-dd', new Date(), options)

    if (!isValid(parsedDob) || `${value.dobYear}`.length !== 4) {
      return helper.message('Enter a real date')
    }

    if (isAfter(parsedDob, today)) {
      return helper.message('Date of birth must be in the past')
    }

    const age = differenceInYears(today, parsedDob, options)

    if (age < 16) {
      return helper.message('The dog owner must be aged 16 or over')
    }
  }

  return value
}

const schema = Joi.object({
  firstName: Joi.string().trim().required().max(30).messages({
    'string.empty': 'Enter a first name',
    'string.max': 'First name must be no more than {#limit} characters'
  }),
  lastName: Joi.string().trim().required().max(24).messages({
    'string.empty': 'Enter a last name',
    'string.max': 'Last name must be no more than {#limit} characters'
  }),
  dobDay: Joi.number().optional().allow('').messages({
    'number.base': 'Date of birth must include a day'
  }),
  dobMonth: Joi.number().optional().allow('').messages({
    'number.base': 'Date of birth must include a month'
  }),
  dobYear: Joi.number().optional().allow('').messages({
    'number.base': 'Date of birth must include a year'
  }),
  postcode: Joi.string().trim().max(8).when('triggeredButton', {
    is: Joi.exist(),
    then: Joi.required().messages({
      'string.empty': 'Enter a postcode',
      'string.max': 'Postcode must be no more than {#limit} characters'
    }),
    otherwise: Joi.optional().allow('')
  }),
  houseNumber: Joi.string().trim().max(50).optional().allow('').messages({
    'string.max': 'Property name or number must be no more than {#limit} characters'
  }),
  triggeredButton: Joi.string().trim().optional().allow('')
}).required().custom(validate)

module.exports = schema
