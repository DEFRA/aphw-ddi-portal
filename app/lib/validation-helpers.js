const Joi = require('joi')
const { isFuture, isWithinInterval, sub, addMonths, startOfDay, differenceInYears } = require('date-fns')
const { parseDate } = require('./date-helpers')
const { getPersonAndDogs } = require('../api/ddi-index-api/person')
const validNewMicrochip = /^\d+$/

const invalidBreedForCountryMessage = 'The address for an XL Bully dog must be in England or Wales'

const validateMicrochip = (value, helpers, compareOrig = false) => {
  let elemName = helpers.state.path[0]

  // Compare new value against original to determine if already pre-populated in the DB
  // (old microchip numbers from legacy data can contain letters so don't validate against new rules)
  if (compareOrig) {
    if (elemName?.length > 1) {
      elemName = elemName.substring(0, 1).toUpperCase() + elemName.substring(1)
    }
    if (value === helpers.state.ancestors[0][`orig${elemName}`]) {
      return value
    }
  }

  if (value?.length < 15) {
    return helpers.message('Microchip numbers must be 15 numbers long', { path: [elemName] })
  }

  if (!value.match(validNewMicrochip)) {
    return helpers.message('Microchip numbers can only contain numbers', { path: [elemName] })
  }

  return value
}

const validateCdoIssueDate = (value, helpers) => {
  if (helpers.state.ancestors[0].applicationType !== 'cdo') {
    return null
  }

  const { day, month, year } = value
  const dateComponents = { day, month, year }
  const invalidComponents = []

  for (const key in dateComponents) {
    if (!dateComponents[key]) {
      invalidComponents.push(key)
    }
  }

  if (parseInt(year) < 2020) {
    return helpers.message('The CDO issue year must be 2020 or later', { path: ['cdoIssued', ['year']] })
  }

  if (invalidComponents.length === 0) {
    const dateString = `${year}-${month}-${day}`
    const date = parseDate(dateString)

    if (!date) {
      return helpers.message('Enter a real date', { path: ['cdoIssued', ['day', 'month', 'year']] })
    }

    if (isFuture(date)) {
      return helpers.message('Enter a date that is today or in the past', { path: ['cdoIssued', ['day', 'month', 'year']] })
    }

    return date
  }

  if (invalidComponents.length === 3) {
    return helpers.message('Enter a CDO issue date', { path: ['cdoIssued', ['day', 'month', 'year']] })
  }

  const errorMessage = `A CDO issue date must include a ${invalidComponents.join(' and ')}`

  return helpers.message(errorMessage, { path: ['cdoIssued', invalidComponents] })
}

const validateInterimExemptionDate = (value, helpers) => {
  if (helpers.state.ancestors[0].applicationType !== 'interim-exemption') {
    return null
  }

  const { day, month, year } = value
  const dateComponents = { day, month, year }
  const invalidComponents = []

  for (const key in dateComponents) {
    if (!dateComponents[key]) {
      invalidComponents.push(key)
    }
  }

  if (invalidComponents.length === 0) {
    const dateString = `${year}-${month}-${day}`
    const date = parseDate(dateString)

    if (!date) {
      return helpers.message('Enter a real date', { path: ['interimExemption', ['day', 'month', 'year']] })
    }

    if (isFuture(date)) {
      return helpers.message('Enter a date that is today or in the past', { path: ['interimExemption', ['day', 'month', 'year']] })
    }

    const now = new Date()
    if (!isWithinInterval(date, { start: sub(now, { years: 1 }), end: now })) {
      return helpers.message('Date joined scheme year must be within the last 12 months', { path: ['interimExemption', ['year']] })
    }

    return date
  }

  if (invalidComponents.length === 3) {
    return helpers.message('Enter a Date joined scheme', { path: ['interimExemption', ['day', 'month', 'year']] })
  }

  const errorMessage = `Date joined scheme must include a ${invalidComponents.join(' and ')}`

  return helpers.message(errorMessage, { path: ['interimExemption', invalidComponents] })
}

const calculateCdoExpiryDate = (value) => {
  const dateString = `${value.year}-${value.month}-${value.day}`

  if (dateString === '--' || dateString === 'undefined-undefined-undefined') {
    return null
  }

  return addMonths(parseDate(dateString), 2)
}

const validateOwnerDateOfBirth = (value, helpers) => {
  const { day, month, year } = value
  const dateComponents = { day, month, year }
  const invalidComponents = []

  for (const key in dateComponents) {
    if (!dateComponents[key]) {
      invalidComponents.push(key)
    }
  }

  if (invalidComponents.length === 0) {
    const dateString = `${year}-${month}-${day}`
    const date = parseDate(dateString)

    const messageText = validateDob(date, year)
    if (messageText) {
      return helpers.message(messageText, { path: ['birthDate', ['day', 'month', 'year']] })
    }

    return date
  }

  if (invalidComponents.length === 3) {
    return null
  }

  const errorMessage = `An owner date of birth must include a ${invalidComponents.join(' and ')}`

  return helpers.message(errorMessage, { path: ['birthDate', invalidComponents] })
}

const notOldEnough = date => {
  const today = startOfDay(new Date())

  const age = differenceInYears(today, date, { locale: 'enGB' })

  return age < 16
}

const validateDob = (date, year) => {
  if (!date) {
    return year.length !== 4 ? 'Enter a 4-digit year' : 'Enter a real date'
  }

  if (year.length !== 4) {
    return 'Enter a 4-digit year'
  }

  if (isFuture(date)) {
    return 'Enter a date of birth that is in the past'
  }

  if (notOldEnough(date)) {
    return 'The dog owner must be aged 16 or over'
  }
  return null
}

const validateBreedForCountry = (value, helpers) => {
  const elemName = 'breed'
  const country = helpers.state.ancestors[0].country

  if (value === 'XL Bully' && country === 'Scotland') {
    return helpers.message(invalidBreedForCountryMessage, { path: [elemName] })
  }

  return value
}

const validateBreedForCountryChoosingAddress = async (personReference, payload, fieldName = 'address') => {
  const ownerAndDogs = await getPersonAndDogs(personReference)

  return (ownerAndDogs.dogs.some(dog => dog.breed === 'XL Bully') && payload.address.country === 'Scotland')
    ? new Joi.ValidationError(invalidBreedForCountryMessage, [{ message: invalidBreedForCountryMessage, path: [fieldName], type: 'custom' }])
    : null
}

const validateBreedForCountryChangingOwner = (dog, address, fieldName) => {
  return dog.breed === 'XL Bully' && address.country === 'Scotland'
    ? new Joi.ValidationError(invalidBreedForCountryMessage, [{ message: invalidBreedForCountryMessage, path: [fieldName], type: 'custom' }])
    : null
}

module.exports = {
  validateMicrochip,
  validateCdoIssueDate,
  validateInterimExemptionDate,
  calculateCdoExpiryDate,
  validateOwnerDateOfBirth,
  validateBreedForCountry,
  validateBreedForCountryChoosingAddress,
  validateBreedForCountryChangingOwner
}
