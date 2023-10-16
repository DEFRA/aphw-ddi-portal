const Joi = require('joi')
const { startOfDay, parse, isAfter, isValid, differenceInYears } = require('date-fns')

const validate = (value, helper) => {
  const options = {
    locale: 'enGB'
  }

  const dob = `${value.year}-${value.month}-${value.day}`

  const today = startOfDay(new Date())
  const parsedDob = parse(dob, 'yyyy-MM-dd', new Date(), options)

  if (!isValid(parsedDob)) {
    return helper.message('The owner\'s date of birth must be a real date.')
  }

  if (isAfter(parsedDob, today)) {
    return helper.message('The owner\'s date of birth must be in the past')
  }

  const age = differenceInYears(today, parsedDob, options)

  if (age < 18) {
    return helper.message('The owner must be aged 18 or over to register a dangerous dog.')
  }

  return value
}

const schema = Joi.object({
  day: Joi.number().required().messages({
    'number.base': 'Date of birth must include a day'
  }),
  month: Joi.number().required().messages({
    'number.base': 'Date of birth must include a month'
  }),
  year: Joi.number().required().messages({
    'number.base': 'Date of birth must include a year'
  })
}).required().custom(validate)

module.exports = schema
