const { get, post } = require('./base')
const createCdoSchema = require('../../schema/ddi-index-api/cdo/create')
const { removeIndividualDateComponents } = require('../../lib/date-helpers')
const { boomRequest } = require('../ddi-index-api/base')

const cdoEndpoint = 'cdo'

const options = {
  json: true
}

const getCdo = async (indexNumber) => {
  const payload = await get(`${cdoEndpoint}/${indexNumber}`, options)
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

const getManageCdoDetails = async (indexNumber) => {
  const payload = await get(`${cdoEndpoint}/${indexNumber}/manage`, options)
  return payload
}

const getCdoTaskDetails = async (indexNumber, taskName) => {
  const payload = await get(`${cdoEndpoint}/${indexNumber}/manage`, options)
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
