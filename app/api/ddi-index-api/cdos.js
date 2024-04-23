const { get } = require('./base')
const { fi } = require('date-fns/locale')

const cdosEndpoint = 'cdos'

const options = {
  json: true
}
/**
 * @typedef SummaryPersonDto
 * @property {number} id - e.g. 10,
 * @property {string} firstName - e.g. 'Scott',
 * @property {string} lastName - e.g. 'Pilgrim',
 * @property {string} personReference - e.g. 'P-1234-5678'
 */
/**
 * @typedef SummaryDogDto
 * @property {number} id - e.g. 300013,
 * @property {string} dogReference - e.g. 'ED300013',
 * @property {string} status - e.g. 'Pre-exempt'
 */
/**
 * @typedef SummaryExemptionDto
 * @property {string} policeForce - e.g. 'Cheshire Constabulary',
 * @property {string} cdoExpiry - e.g. '2024-03-01'
 */
/**
 * @typedef SummaryCdoDto
 * @property {SummaryPersonDto} person
 * @property {SummaryDogDto} dog
 * @property {SummaryExemptionDto} exemption
 */

/**
 * @typedef SummaryCdo
 * @property {number} id - e.g. 300013,
 * @property {string} index - e.g. 'ED300013',
 * @property {string} status - e.g. 'Pre-exempt',
 * @property {string} owner - e.g. 'Scott Pilgrim',
 * @property {string} personReference - e.g. 'P-1234-5678',
 * @property {Date} cdoExpiry - e.g. 2024-03-01,
 * @property {string} policeForce - e.g. 'Cheshire Constabulary'
 */

/**
 * @param {SummaryCdoDto} summaryCdo
 * @return {SummaryCdo}
 */
const summaryCdoMapper = (summaryCdo) => {
  const owner = [
    summaryCdo.person.firstName,
    summaryCdo.person.lastName
  ].join(' ')

  return {
    id: summaryCdo.dog.id,
    index: summaryCdo.dog.dogReference,
    owner,
    personReference: summaryCdo.person.personReference,
    policeForce: summaryCdo.exemption.policeForce,
    status: summaryCdo.dog.status,
    cdoExpiry: new Date(summaryCdo.exemption.cdoExpiry)
  }
}
/**
 * @typedef {'InterimExempt'|'PreExempt'|'Exempt'|'Failed'|'InBreach'|'Withdrawn'|'Inactive'} CdoStatusShort
 */
/**
 *
 * @param {{status?: CdoStatusShort[]; dueWithin?: number;}} filter
 * @return {Promise<SummaryCdo[]>}
 */
const getSummaryCdos = async (filter) => {
  const searchParams = new URLSearchParams()

  if (filter.status) {
    filter.status.forEach(status => {
      searchParams.append('status', status)
    })
  }

  if (filter.dueWithin) {
    searchParams.set('withinDays', filter.dueWithin.toString())
  }

  const queryParams = searchParams.toString()
  const payload = await get(`${cdosEndpoint}?${queryParams}`, options)
  return payload.cdos.map(summaryCdoMapper)
}

module.exports = {
  getSummaryCdos
}
