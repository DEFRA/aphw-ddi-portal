const { get, post, callDelete } = require('./base')
const { ApiConflictError } = require('../../errors/api-conflict-error')

const insuranceEndpoint = 'insurance'
const insuranceCompaniesEndpoint = `${insuranceEndpoint}/companies`

const options = {
  json: true
}
/**
 * @typedef {{ id: number; name: string }} InsuranceCompany
 */
/**
 *
 * @return {Promise<InsuranceCompany[]>}
 */

const getCompanies = async () => {
  const payload = await get(insuranceCompaniesEndpoint, options)

  return payload.companies
}

/**
 * @typedef {{name: string}} InsuranceCompanyRequest
 */

/**
 * @param {PoliceForceRequest} insuranceCompany
 * @param user
 * @return {Promise<CourtRequest>}
 */
const addInsuranceCompany = async (insuranceCompany, user) => {
  const data = {
    name: insuranceCompany.name
  }

  try {
    const payload = await post(insuranceCompaniesEndpoint, data, user)

    return payload
  } catch (e) {
    if (e.isBoom && e.output.statusCode === 409) {
      throw new ApiConflictError({
        ...e,
        message: 'This insurance company is already in the Index'
      })
    }
    throw e
  }
}

const removeInsuranceCompany = async (insuranceCompanyId, user) => {
  await callDelete(`${insuranceCompaniesEndpoint}/${insuranceCompanyId}`, user)
}

module.exports = {
  getCompanies,
  addInsuranceCompany,
  removeInsuranceCompany
}
