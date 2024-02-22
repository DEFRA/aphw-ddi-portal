const { get } = require('./base')

const jobsEndpoint = 'regular-jobs'

const options = {
  json: true
}

const getRegularJobs = async () => {
  const payload = await get(jobsEndpoint, options)

  return payload.jobs
}

module.exports = {
  getRegularJobs
}
