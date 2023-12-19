const { get, put } = require('./base')
const editDogSchema = require('../../schema/portal/edit/dog-details')

const dogEndpoint = 'dog'

const options = {
  json: true
}

const getDogDetails = async (indexNumber) => {
  const payload = await get(`${dogEndpoint}/${indexNumber}`, options)
  return payload.dog
}

const updateDogDetails = async (dog) => {
  const { error } = editDogSchema.validatePayload(dog)

  if (error) {
    throw error
  }

  console.log('put dog', dog)
  return await put(dogEndpoint, dog)
}

module.exports = {
  updateDogDetails,
  getDogDetails
}
