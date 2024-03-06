const { keys } = require('../../constants/cdo/dog')

const getDogIndex = (entry, dogId) => {
  if (dogId === undefined) {
    return entry.length - 1
  }

  return +dogId - 1
}

const set = (request, entryKey, key, value) => {
  const entryValue = request.yar?.get(entryKey) || {}
  entryValue[key] = typeof (value) === 'string' ? value.trim() : value
  request.yar.set(entryKey, entryValue)
}

const get = (request) => {
  return request.yar?.get(keys.entry) || [{}]
}

const getDogs = (request) => {
  return get(request)
}

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

const addAnotherDog = (request) => {
  const entryValue = get(request)

  entryValue.push({})

  request.yar.set(keys.entry, entryValue)
}

const deleteDog = (request) => {
  const entry = get(request)

  const index = getDogIndex(entry, request.payload?.dogId)

  entry.splice(index, 1)

  request.yar.set(keys.entry, entry)
}

const getMicrochipDetails = (request) => {
  return get(request, keys.microchipSearch, keys.phoneNumber)
}

const setMicrochipDetails = (request, value) => {
  set(request, keys.entry, keys.microchipSearch, value)
}

module.exports = {
  getDog,
  getDogs,
  setDog,
  addAnotherDog,
  deleteDog,
  setMicrochipDetails,
  getMicrochipDetails
}
