const { get, post } = require('./base')
const createCdoSchema = require('../../schema/ddi-index-api/cdo/create')
const { removeIndividualDateComponents } = require('../../lib/date-helpers')
const { boomRequest } = require('../ddi-index-api/base')

const cdoEndpoint = 'cdo'

/**
 * @typedef CdoDog
 * @property {number} id
 * @property {string} dogReference
 * @property {string} indexNumber
 * @property {string} name
 * @property {string} breed
 * @property {string} status
 * @property {string} subStatus
 * @property {string|Date} dateOfBirth
 * @property {string|Date} dateOfDeath
 * @property {string} tattoo
 * @property {string} colour
 * @property {string} sex
 * @property {string|Date} dateExported
 * @property {string|Date} dateStolen
 * @property {string|Date} dateUntraceable
 * @property {string} microchipNumber
 * @property {string} microchipNumber2
 * @property {string[]} breaches
 */
/**
 * @typedef CdoAddress
 * @property {number} id
 * @property {number} person_id
 * @property {number} address_id
 * @property {{
 *  id: number;
 *  address_line_1: string;
 *  address_line_2: string;
 *  town: string;
 *  postcode: string;
 *  county: string;
 *  country_id: number;
 *  country: {
 *    id: number;
 *    country: 'string'
 *  }
 * }} address
 */
/**
 * @typedef CdoDtoPerson
 * @property {number} id
 * @property {string} personReference
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth: '2024-11-28'
 * @property {CdoAddress[]} addresses
 * @property {{
 *    id: 0,
 *    person_id: 0,
 *    contact_id: 0,
 *    contact: {
 *      id: 0,
 *      contact: 'string',
 *      contact_type_id: 0,
 *      contact_type: {
 *        id: 0,
 *        contact_type: 'string'
 *      }
 *    }
 * }[]} person_contacts
 * @property {string} organisationName
 */
/**
 * @typedef CdoDtoExemption
 * @property {'1991'|'2023'|'2015'} exemptionOrder
 * @property {string|Date} cdoIssued
 * @property {string|Date} cdoExpiry
 * @property {string} court
 * @property {string} policeForce
 * @property {string} legislationOfficer
 * @property {string|Date} certificateIssued
 * @property {string|Date} applicationFeePaid
 * @property {{
 *   company: string;
 *   insuranceRenewal: string;
 * }[]} insurance
 * @property {string|Date} neuteringConfirmation
 * @property {string|Date} microchipVerification
 * @property {string|Date} joinedExemptionScheme
 * @property {string|Date} nonComplianceLetterSent
 */
/**
 * @typedef CdoDto
 * @property {CdoDtoPerson} person
 * @property {CdoDog} dog
 * @property {CdoDtoExemption} exemption
 */

/**
 * @param data
 * @return {CdoDto}
 */
/**
 * @param indexNumber
 * @param user
 * @return {Promise<CdoDto>}
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

  return post(cdoEndpoint, value, user)
}

/**
 * @param indexNumber
 * @param user
 * @return {Promise<unknown>}
 */
const getManageCdoDetails = async (indexNumber, user) => {
  return get(`${cdoEndpoint}/${indexNumber}/manage`, user)
}

/**
 * @typedef CdoTaskDto
 * @property {string} key
 * @property {boolean} available
 * @property {boolean} completed
 * @property {boolean} readonly
 * @property {string|undefined} timestamp
 */
/**
 * @typedef CdoTaskListTasksDto
 * @property {CdoTaskDto} applicationPackSent
 * @property {CdoTaskDto} microchipNumberRecorded
 * @property {CdoTaskDto} applicationFeePaid
 * @property {CdoTaskDto} insuranceDetailsRecorded
 * @property {CdoTaskDto} form2Sent
 * @property {CdoTaskDto} verificationDateRecorded
 * @property {CdoTaskDto} certificateIssued
 */
/**
 * @typedef CdoVerificationOptions
 * @property {boolean} dogDeclaredUnfit
 * @property {boolean} neuteringBypassedUnder16
 * @property {boolean} allowDogDeclaredUnfit
 * @property {boolean} allowNeuteringBypass
 * @property {boolean} showNeuteringBypass
 */
/**
 * @typedef CdoSummary
 * @property {{ name: string }} dog
 * @property {{ cdoExpiry: Date|undefined }} exemption
 * @property {{ firstName: string; lastName: string }} person
 */
/**
 * @typedef CdoTaskListDto
 * @property {CdoTaskListTasksDto} tasks
 * @property {Date|undefined} applicationPackSent
 * @property {string|undefined} insuranceCompany
 * @property {Date|undefined} insuranceRenewal
 * @property {string|undefined} microchipNumber
 * @property {string|undefined} microchipNumber2
 * @property {Date|undefined} applicationFeePaid
 * @property {Date|undefined} form2Sent
 * @property {Date|undefined} neuteringConfirmation
 * @property {Date|undefined} microchipVerification
 * @property {Date|undefined} microchipDeadline
 * @property {Date|undefined} certificateIssued
 * @property {CdoVerificationOptions} verificationOptions
 * @property {CdoSummary} cdoSummary
 */

/**
 * @param indexNumber
 * @param user
 * @return {Promise<unknown>}
 */
const getCdoTaskDetails = async (indexNumber, user) => {
  return get(`${cdoEndpoint}/${indexNumber}/manage`, user)
}

const saveCdoTaskDetails = async (indexNumber, apiKey, payload, user) => {
  payload = removeIndividualDateComponents(payload)

  delete payload.taskName
  return boomRequest(`${cdoEndpoint}/${indexNumber}/manage:${apiKey}`, 'POST', payload, user)
}

module.exports = {
  createCdo,
  getCdo,
  getManageCdoDetails,
  getCdoTaskDetails,
  saveCdoTaskDetails
}
