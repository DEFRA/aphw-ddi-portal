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

    if (!isValid(parsedDob)) {
      return helper.message('The owner\'s date of birth must be a real date.')
    }

    if (isAfter(parsedDob, today)) {
      return helper.message('The owner\'s date of birth must be in the past')
    }

    const age = differenceInYears(today, parsedDob, options)

    if (age < 16) {
      return helper.message('The owner must be aged 16 or over to register a dangerous dog.')
    }
  }

  return value
}

const schema = Joi.object({
  firstName: Joi.string().trim().required().messages({
    'string.empty': 'Owner\'s first name is required'
  }),
  lastName: Joi.string().trim().required().messages({
    'string.empty': 'Owner\'s last name is required'
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
  postcode: Joi.string().trim().required().messages({
    'string.empty': 'Postcode is required'
  }),
  houseNumber: Joi.string().trim().optional().allow('')
}).required().custom(validate)

module.exports = schema
