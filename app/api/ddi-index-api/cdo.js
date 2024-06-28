const { get, post } = require('./base')
const createCdoSchema = require('../../schema/ddi-index-api/cdo/create')

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

const saveCdoTaskDetails = async (indexNumber, taskName, payload, user) => {
  const res = await post(`${cdoEndpoint}/${indexNumber}/manage:${taskName}`, payload, user)
  return res
}

module.exports = {
  createCdo,
  getCdo,
  getManageCdoDetails,
  getCdoTaskDetails,
  saveCdoTaskDetails
}
