const { get } = require('./base')

const activityEndpoint = 'activity'

const getActivityById = async (activityId) => {
  const payload = await get(`${activityEndpoint}/${activityId}`)

  return payload.activity
}

module.exports = {
  getActivityById
}
