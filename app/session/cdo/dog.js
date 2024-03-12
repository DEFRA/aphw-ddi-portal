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

const getMicrochipResults = (request) => {
  return request.yar?.get(keys.microchipSearch) || {}
}

const setMicrochipResults = (request, value) => {
  request.yar.set(keys.microchipSearch, value)
}

module.exports = {
  getDog,
  getDogs,
  setDog,
  addAnotherDog,
  deleteDog,
  setMicrochipResults,
  getMicrochipResults
}
