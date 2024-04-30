const { get, post, callDelete } = require('./base')

const courtsEndpoint = 'courts'

const options = {
  json: true
}

/**
 * @typedef Court
 * @return {{
 *   id: number;
 *   name: string;
 * }}
 */

/**
 * @return {Promise<Court[]>}
 */
const getCourts = async () => {
  const payload = await get(courtsEndpoint, options)

  return payload.courts
}

/**
 * @typedef CourtRequest
 * @property {string} name
 */

/**
 * @param {CourtRequest} court
 * @return {Promise<CourtRequest>}
 */
const addCourt = async (court, user) => {
  const data = {
    name: court.name
  }
  const payload = await post(courtsEndpoint, data, user)

  return payload
}

const removeCourt = async (courtId, user) => {
  await callDelete(`${courtsEndpoint}/${courtId}`, user)
}

module.exports = {
  getCourts,
  removeCourt,
  addCourt
}
