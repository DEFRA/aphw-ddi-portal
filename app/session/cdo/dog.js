const { keys } = require('../../constants/cdo/dog')

const getDogIndex = (entry, dogId) => {
  if (dogId === undefined) {
    return entry.length - 1
  }

  return +dogId - 1
}

const get = (request) => {
  return request.yar?.get(keys.entry) || [{}]
}

/**
 * @typedef DogSession
 * @property {string} breed - e.g. 'XL Bully',
 * @property {string} name - e.g. '',
 * @property {string} applicationType - e.g. 'cdo',
 * @property {string} country - e.g. 'England',
 * @property {string|null} cdoIssued - e.g. '2024-01-01T00:00:00.000Z',
 * @property {string|null} cdoExpiry - e.g. '2024-03-01T00:00:00.000Z',
 * @property {string|null} interimExemption - e.g. null
 */

/**
 * @param request
 * @return {DogSession[]}
 */
const getDogs = (request) => {
  return get(request)
}

/**
 * @param request
 * @return {DogSession}
 */
const getDog = (request) => {
  const entryValue = get(request)

  const dog = getDogIndex(entryValue, request.params?.dogId)

  return entryValue[dog]
}

const setDog = (request, value) => {
  const dogs = get(request)

  const index = getDogIndex(dogs, value.dogId)

  const dogValue = dogs[index]

  if (dogValue === undefined) {
    const error = new Error(`Dog ${index} does not exist`)

    error.type = 'DOG_NOT_FOUND'

    throw error
  }

  delete value.id

  dogs[index] = value

  request.yar.set(keys.entry, dogs)
}

const clearAllDogs = (request) => {
  request.yar.set(keys.entry, null)
}

const addAnotherDog = (request) => {
  const entryValue = get(request)

  entryValue.push({})

  request.yar.set(keys.entry, entryValue)
}

const deleteDog = (request) => {
  const entry = get(request)

  const index = getDogIndex(entry, request.payload?.dogId)

  entry.splice(index, 1)

  renumberEntries(entry)

  request.yar.set(keys.entry, entry)
}

const renumberEntries = entries => {
  if (entries) {
    entries.forEach((value, index) => {
      value.dogId = index + 1
    })
  }
}

const getMicrochipResults = (request) => {
  return request.yar?.get(keys.microchipSearch) || {}
}

const setMicrochipResults = (request, value) => {
  request.yar.set(keys.microchipSearch, value)
}

const setExistingDogs = (request, value) => {
  request.yar.set(keys.existingDogs, value)
}

const getExistingDogs = (request) => {
  return request.yar?.get(keys.existingDogs) || []
}

module.exports = {
  getDog,
  getDogs,
  setDog,
  addAnotherDog,
  deleteDog,
  setMicrochipResults,
  getMicrochipResults,
  renumberEntries,
  setExistingDogs,
  getExistingDogs,
  clearAllDogs
}
