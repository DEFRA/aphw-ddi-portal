const { keys } = require('../../constants/admin')

const getDogsForDeletion = (request, step) => {
  return request.yar?.get(`${keys.oldDogs}${step}`) || []
}

const setDogsForDeletion = (request, step, value) => {
  request.yar.set(`${keys.oldDogs}${step}`, typeof value === 'string' ? [value] : value || [])
}

const initialiseDogsForDeletion = (request, dogs) => {
  setDogsForDeletion(request, 1, dogs.map(dog => dog.indexNumber))
  setDogsForDeletion(request, 2, [])
}

module.exports = {
  getDogsForDeletion,
  setDogsForDeletion,
  initialiseDogsForDeletion
}
