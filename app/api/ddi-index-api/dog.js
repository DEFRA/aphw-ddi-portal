const { get, put } = require('./base')

const dogEndpoint = 'dog'

const options = {
  json: true
}

const getDogDetails = async (indexNumber) => {
  const payload = await get(`${dogEndpoint}/${indexNumber}`, options)
  return payload.dog
}

const getDogOwner = async (indexNumber) => {
  const payload = await get(`dog-owner/${indexNumber}`, options)
  return payload.owner
}

const updateDogDetails = async (dog, username) => {
  dog.dogId = dog.id
  return await put(dogEndpoint, dog, username)
}

const updateStatus = async (payload, user) => {
  if (!payload?.indexNumber || !payload?.newStatus) {
    throw new Error('Invalid payload')
  }

  const dog = await getDogDetails(payload.indexNumber)
  dog.dogId = dog.id
  dog.status = payload.newStatus

  return await put(dogEndpoint, dog, user)
}

module.exports = {
  updateDogDetails,
  updateStatus,
  getDogDetails,
  getDogOwner
}
