const { get } = require('./base')

const activitiesEndpoint = 'activities'

const getActivities = async (activityType, activitySource) => {
  const payload = await get(`${activitiesEndpoint}/${activityType}/${activitySource}`)

  return payload.activities
}

module.exports = {
  getActivities
}
