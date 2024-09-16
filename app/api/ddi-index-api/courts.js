const { get, post, callDelete } = require('./base')
const { ApiConflictError } = require('../../errors/api-conflict-error')

const courtsEndpoint = 'courts'

/**
 * @typedef Court
 * @return {{
 *   id: number;
 *   name: string;
 * }}
 */

/**
 *
 * @param user
 * @return {Promise<Court[]>}
 */
const getCourts = async (user) => {
  const payload = await get(courtsEndpoint, user)

  return payload.courts
}

/**
 * @typedef CourtRequest
 * @property {string} name
 */

/**
 * @param {CourtRequest} court
 * @param user
 * @return {Promise<CourtRequest>}
 */
const addCourt = async (court, user) => {
  const data = {
    name: court.name
  }

  try {
    const payload = await post(courtsEndpoint, data, user)

    return payload
  } catch (e) {
    if (e.isBoom && e.output.statusCode === 409) {
      throw new ApiConflictError({
        ...e,
        message: 'This court name is already listed'
      })
    }
    throw e
  }
}

const removeCourt = async (courtId, user) => {
  await callDelete(`${courtsEndpoint}/${courtId}`, user)
}

module.exports = {
  getCourts,
  removeCourt,
  addCourt
}
