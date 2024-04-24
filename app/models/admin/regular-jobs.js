const { formatToDateTime, getElapsed } = require('../../lib/date-helpers')

function ViewModel (jobs) {
  this.model = {
    jobs: mapJobs(jobs)
  }
}

const mapJobs = (jobs) => jobs.map(job => ({
  id: job.id,
  start_time: formatToDateTime(job.start_time),
  end_time: getElapsed(job.end_time, job.start_time),
  result: job.result
}))

module.exports = ViewModel
