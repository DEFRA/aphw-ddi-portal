const { get, put } = require('./base')

const dogEndpoint = 'dog'

const options = {
  json: true
}

const getDogDetails = async (indexNumber) => {
  const payload = await get(`${dogEndpoint}/${indexNumber}`, options)
  return payload.dog
}

const updateDogDetails = async (dog) => {
  dog.dogId = dog.id
  return await put(dogEndpoint, dog)
}

const updateStatus = async (payload) => {
  if (!payload?.indexNumber || !payload?.newStatus) {
    throw new Error('Invalid payload')
  }

  const dog = await getDogDetails(payload.indexNumber)
  dog.dogId = dog.id
  dog.status = payload.newStatus

  return await put(dogEndpoint, dog)
}

module.exports = {
  updateDogDetails,
  updateStatus,
  getDogDetails
}
