const { post } = require('./base')

const purgeSoftDeleteEndpoint = 'jobs/purge-soft-delete'
const neuteringDeadlineEndpoint = 'jobs/neutering-deadline'

const purgeSoftDelete = async (today = null) => {
  const todayParam = today ? `?today=${today}` : ''
  const payload = await post(`${purgeSoftDeleteEndpoint}${todayParam}`)
  return payload
}

const neuteringDeadline = async (today = null) => {
  const todayParam = today ? `?today=${today}` : ''
  const payload = await post(`${neuteringDeadlineEndpoint}${todayParam}`)
  return payload
}

module.exports = {
  purgeSoftDelete,
  neuteringDeadline
}
