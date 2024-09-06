const { get, callDelete, boomRequest } = require('./base')
const { ApiErrorFailure } = require('../../errors/api-error-failure')
const { ApiConflictError } = require('../../errors/api-conflict-error')

const dogEndpoint = 'dog'

/**
 * @param indexNumber
 * @param user
 * @return {Promise<*>}
 */
const getDogDetails = async (indexNumber, user) => {
  const payload = await get(`${dogEndpoint}/${indexNumber}`, user)
  return payload.dog
}

/**
 * @param indexNumber
 * @param user
 * @return {Promise<*>}
 */
const getDogOwner = async (indexNumber, user) => {
  const payload = await get(`dog-owner/${indexNumber}`, user)
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
 * @param user
 * @return {Promise<PersonAndDogsDto>}
 */
const getDogOwnerWithDogs = async (indexNumber, user) => {
  const payload = await get(`dog-owner/${indexNumber}?includeDogs=true`, user)
  return payload.owner
}

const updateDogDetails = async (dog, user) => {
  dog.dogId = dog.id

  try {
    const response = await boomRequest(dogEndpoint, 'PUT', dog, user)
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

  try {
    const dog = await getDogDetails(payload.indexNumber, user)
    dog.dogId = dog.id
    dog.status = payload.newStatus

    return await boomRequest(dogEndpoint, 'PUT', dog, user)
  } catch (e) {
    if (e instanceof ApiErrorFailure) {
      if (e.boom.statusCode === 409) {
        throw new ApiConflictError(e)
      }
    }
    throw e
  }
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
