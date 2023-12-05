const { keys } = require('../../constants/cdo/dog')

const getDogIndex = (entry, index) => {
  if (index === undefined) {
    return entry.length - 1
  }

  return index - 1
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

module.exports = {
  getDog,
  getDogs,
  setDog,
  addAnotherDog
}
