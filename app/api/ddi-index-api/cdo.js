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

const createCdo = async (cdo) => {
  const { value, error } = createCdoSchema.validate(cdo)

  if (error) {
    throw error
  }

  const res = await post(cdoEndpoint, value)

  return res
}

module.exports = {
  createCdo,
  getCdo
}
