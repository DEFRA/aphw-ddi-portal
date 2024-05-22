const { get, put, callDelete, boomRequest } = require('./base')
const { ApiErrorFailure } = require('../../errors/api-error-failure')
const { ApiConflictError } = require('../../errors/api-conflict-error')

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

/**
 * @typedef AddressDto
 * @property {string} country
 * @property {string} town
 * @property {string} postcode
 * @property {string} addressLine1
 * @property {string} addressLine2
 */
/**
 * @typedef DogDto
 * @property {number} id
 * @property {string} indexNumber
 * @property {string} dogReference
 * @property {string} microchipNumber
 * @property {string} microchipNumber2
 * @property {string} breed
 * @property {string} name
 * @property {string} status
 * @property {Date} birthDate
 * @property {string} tattoo
 * @property {string} colour
 * @property {string} sex
 */
/**
 * @typedef {unknown} PersonContact
 */
/**
 * @typedef PersonAndDogsDto
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} birthDate
 * @property {string} personReference
 * @property {string} organisationName
 * @property {AddressDto} address
 * @property {DogDto[]} dogs
 * @property {PersonContact[]} contacts
 */

/**
 * @param indexNumber
 * @return {Promise<PersonAndDogsDto>}
 */
const getDogOwnerWithDogs = async (indexNumber) => {
  const payload = await get(`dog-owner/${indexNumber}?includeDogs=true`, options)
  return payload.owner
}

const updateDogDetails = async (dog, username) => {
  dog.dogId = dog.id

  try {
    const response = await boomRequest(dogEndpoint, 'PUT', dog, username)
    return response.payload
  } catch (e) {
    if (e instanceof ApiErrorFailure) {
      if (e.boom.statusCode === 409) {
        throw new ApiConflictError(e)
      }
    }
    throw e
  }
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

const deleteDog = async (indexNumber, user) => {
  return callDelete(`${dogEndpoint}/${indexNumber}`, user)
}

module.exports = {
  updateDogDetails,
  updateStatus,
  getDogDetails,
  getDogOwner,
  getDogOwnerWithDogs,
  deleteDog
}
