const { keys } = require('../../constants/cdo/dog')

const calcDogIndex = (entry) => entry.length - 1

const set = (request, entryKey, value) => {
  const entryValue = request.yar?.get(entryKey) || [{}]

  const dog = calcDogIndex(entryValue)

  entryValue[dog] = value
  request.yar.set(entryKey, entryValue)
}

const get = (request, entryKey) => {
  const entryValue = request.yar?.get(entryKey) ?? [{}]

  const dog = calcDogIndex(entryValue)

  return entryValue[dog]
}

const getDogs = (request) => {
  return request.yar?.get(keys.entry) || [{}]
}

const getDog = (request) => {
  return get(request, keys.entry)
}

const setDog = (request, value) => {
  set(request, keys.entry, value)
}

const addAnotherDog = (request) => {
  const entryValue = request.yar?.get(keys.entry) || []

  entryValue.push({})

  request.yar.set(keys.entry, entryValue)
}

module.exports = {
  getDog,
  getDogs,
  setDog,
  addAnotherDog
}
