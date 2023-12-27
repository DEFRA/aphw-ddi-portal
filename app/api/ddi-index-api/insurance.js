const { get } = require('./base')

const insuranceEndpoint = 'insurance'

const options = {
  json: true
}

const getCompanies = async () => {
  const payload = await get(`${insuranceEndpoint}/companies`, options)

  return payload.companies
}

module.exports = {
  getCompanies
}
