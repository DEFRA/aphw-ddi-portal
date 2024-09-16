const { post } = require('./base')

const purgeSoftDeleteEndpoint = 'jobs/purge-soft-delete'
const neuteringDeadlineEndpoint = 'jobs/neutering-deadline'

const purgeSoftDelete = async (user, today = null) => {
  const todayParam = today ? `?today=${today}` : ''

  return post(`${purgeSoftDeleteEndpoint}${todayParam}`, {}, user)
}

/**
 * @param today
 * @param user
 * @return {Promise<*>}
 */
const neuteringDeadline = async (today, user) => {
  const todayParam = today ? `?today=${today}` : ''

  return post(`${neuteringDeadlineEndpoint}${todayParam}`, {}, user)
}

module.exports = {
  purgeSoftDelete,
  neuteringDeadline
}
