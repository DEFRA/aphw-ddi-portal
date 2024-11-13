const { get, post, callDelete } = require('./base')
const { ApiConflictError } = require('../../errors/api-conflict-error')

const policeForcesEndpoint = 'police-forces'

/**
 * @typedef PoliceForceRequest
 * @property {string} name
 */
/**
 * @typedef PoliceForceDto
 * @property {number} id
 * @property {string} name
 */
/**
 * @param user
 * @return {Promise<PoliceForceDto[]>}
 */
const getPoliceForces = async (user) => {
  const payload = await get(policeForcesEndpoint, user)

  return payload.policeForces
}

/**
 * @param {PoliceForceRequest} policeForce
 * @param user
 * @return {Promise<CourtRequest>}
 */
const addPoliceForce = async (policeForce, user) => {
  const data = {
    name: policeForce.name
  }

  try {
    const payload = await post(policeForcesEndpoint, data, user)

    return payload
  } catch (e) {
    if (e.isBoom && e.output.statusCode === 409) {
      throw new ApiConflictError({
        ...e,
        message: 'This police force is already listed'
      })
    }
    throw e
  }
}

const removePoliceForce = async (policeForceId, user) => {
  await callDelete(`${policeForcesEndpoint}/${policeForceId}`, user)
}

module.exports = {
  getPoliceForces,
  addPoliceForce,
  removePoliceForce
}
