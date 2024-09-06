const { post } = require('./base')

const purgeSoftDeleteEndpoint = 'jobs/purge-soft-delete'
const neuteringDeadlineEndpoint = 'jobs/neutering-deadline'

const purgeSoftDelete = async (user, today = null) => {
  console.log('~~~~~~ Chris Debug ~~~~~~ purgeSoftDelete fn', '')
  const todayParam = today ? `?today=${today}` : ''
  const payload = await post(`${purgeSoftDeleteEndpoint}${todayParam}`, {}, user)
  console.log('~~~~~~ Chris Debug ~~~~~~ puraseSoftDelete fn', 'Payload', payload)
  return payload
}

/**
 * @param today
 * @param user
 * @return {Promise<*>}
 */
const neuteringDeadline = async (today, user) => {
  console.log('~~~~~~ Chris Debug ~~~~~~ neuteringDeadline fn', 'User', user)
  const todayParam = today ? `?today=${today}` : ''
  const payload = await post(`${neuteringDeadlineEndpoint}${todayParam}`, {}, user)
  console.log('~~~~~~ Chris Debug ~~~~~~ neuteringDeadline', 'Payload', payload)
  return payload
}

module.exports = {
  purgeSoftDelete,
  neuteringDeadline
}
