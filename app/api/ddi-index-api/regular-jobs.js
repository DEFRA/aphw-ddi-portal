const { get } = require('./base')

const jobsEndpoint = 'regular-jobs'

/**
 * @param user
 * @return {Promise<*>}
 */
const getRegularJobs = async (user) => {
  const payload = await get(jobsEndpoint, user)

  return payload.jobs
}

module.exports = {
  getRegularJobs
}
