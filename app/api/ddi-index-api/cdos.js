const { get } = require('./base')
const { formatToGds } = require('../../lib/date-helpers')

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
 * @property {string} joinedExemptionScheme - e.g. '2024-03-01'
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
 * @property {Date|null} cdoExpiry - e.g. 2024-03-01,
 * @property {string} humanReadableCdoExpiry - e.g. 2024-03-01,
 * @property {Date|null} joinedExemptionScheme - e.g. 2024-03-01,
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

  const cdoExpiryDto = summaryCdo.exemption.cdoExpiry ?? null
  const joinedExemptionSchemeDto = summaryCdo.exemption.joinedExemptionScheme ?? null
  const cdoExpiry = cdoExpiryDto !== null ? new Date(summaryCdo.exemption.cdoExpiry) : null

  return {
    id: summaryCdo.dog.id,
    index: summaryCdo.dog.dogReference,
    owner,
    personReference: summaryCdo.person.personReference,
    policeForce: summaryCdo.exemption.policeForce,
    status: summaryCdo.dog.status,
    cdoExpiry,
    humanReadableCdoExpiry: formatToGds(cdoExpiry) || '',
    joinedExemptionScheme: joinedExemptionSchemeDto !== null ? new Date(summaryCdo.exemption.joinedExemptionScheme) : null
  }
}
/**
 * @typedef {'InterimExempt'|'PreExempt'|'Exempt'|'Failed'|'InBreach'|'Withdrawn'|'Inactive'} CdoStatusShort
 */
/**
 * @typedef CdoFilter
 * @property {CdoStatusShort[]} [status]
 * @property {number} [dueWithin]
 */
/**
 * @typedef CdoSort
 * @property {string} [column]
 * @property {'ASC'|'DESC'} [order]
 */
/**
 * @param {CdoFilter} filter
 * @param {CdoSort} sort
 * @return {Promise<SummaryCdo[]>}
 */
const getSummaryCdos = async (filter, sort = {}) => {
  const searchParams = new URLSearchParams()

  if (filter.status) {
    filter.status.forEach(status => {
      searchParams.append('status', status)
    })
  }

  if (filter.dueWithin) {
    searchParams.set('withinDays', filter.dueWithin.toString())
  }

  if (sort.column) {
    searchParams.set('sortKey', sort.column)
  }

  if (['ASC', 'DESC'].includes(sort?.order)) {
    searchParams.set('sortOrder', sort.order)
  }

  const queryParams = searchParams.toString()
  const payload = await get(`${cdosEndpoint}?${queryParams}`, options)
  return payload.cdos.map(summaryCdoMapper)
}

const getLiveCdos = async (sort = {}) => {
  const filter = { status: ['PreExempt'] }
  return getSummaryCdos(filter, sort)
}

const getLiveCdosWithinMonth = async (sort = {}) => {
  /**
   * @type {CdoFilter}
   */
  const filter = { status: ['PreExempt'], dueWithin: 30 }
  return getSummaryCdos(filter, sort)
}

/**
 * @param {CdoSort} [sort]
 * @return {Promise<SummaryCdo[]>}
 */
const getInterimExemptions = async (sort = {}) => {
  /**
   * @type {CdoSort}
   */
  const interimSort = {
    column: 'joinedExemptionScheme',
    ...sort
  }

  /**
   * @type {CdoFilter}
   */
  const filter = { status: ['InterimExempt'] }
  return getSummaryCdos(filter, interimSort)
}

module.exports = {
  summaryCdoMapper,
  getSummaryCdos,
  getLiveCdos,
  getLiveCdosWithinMonth,
  getInterimExemptions
}
