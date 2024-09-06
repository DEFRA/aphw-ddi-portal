const { get, post } = require('./base')
const createCdoSchema = require('../../schema/ddi-index-api/cdo/create')
const { removeIndividualDateComponents } = require('../../lib/date-helpers')
const { boomRequest } = require('../ddi-index-api/base')

const cdoEndpoint = 'cdo'

/**
 * @param indexNumber
 * @param user
 * @return {Promise<*>}
 */
const getCdo = async (indexNumber, user) => {
  const payload = await get(`${cdoEndpoint}/${indexNumber}`, user)
  return payload.cdo
}

const createCdo = async (cdo, user) => {
  const { value, error } = createCdoSchema.validate(cdo)

  if (error) {
    throw error
  }

  const res = await post(cdoEndpoint, value, user)

  return res
}

/**
 * @param indexNumber
 * @param user
 * @return {Promise<unknown>}
 */
const getManageCdoDetails = async (indexNumber, user) => {
  const payload = await get(`${cdoEndpoint}/${indexNumber}/manage`, user)
  return payload
}

/**
 * @param indexNumber
 * @param user
 * @return {Promise<unknown>}
 */
const getCdoTaskDetails = async (indexNumber, user) => {
  const payload = await get(`${cdoEndpoint}/${indexNumber}/manage`, user)
  return payload
}

const saveCdoTaskDetails = async (indexNumber, apiKey, payload, user) => {
  payload = removeIndividualDateComponents(payload)

  delete payload.taskName
  const res = await boomRequest(`${cdoEndpoint}/${indexNumber}/manage:${apiKey}`, 'POST', payload, user)
  return res
}

module.exports = {
  createCdo,
  getCdo,
  getManageCdoDetails,
  getCdoTaskDetails,
  saveCdoTaskDetails
}
