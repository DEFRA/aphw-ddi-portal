const { post } = require('./base')

const purgeSoftDeleteEndpoint = 'jobs/purge-soft-delete'

const purgeSoftDelete = async (today = null) => {
  const todayParam = today ? `?today=${today}` : ''
  const payload = await post(`${purgeSoftDeleteEndpoint}${todayParam}`)
  return payload
}

module.exports = {
  purgeSoftDelete
}
