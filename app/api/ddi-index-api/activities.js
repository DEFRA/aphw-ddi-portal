const { get, post } = require('./base')

const activitiesEndpoint = 'activities'
const activityEndpoint = 'activity'

const getActivities = async (activityType, activitySource) => {
  const payload = await get(`${activitiesEndpoint}/${activityType}/${activitySource}`)

  return payload.activities
}

const getActivityById = async (activityId) => {
  const payload = await get(`${activityEndpoint}/${activityId}`)

  return payload.activity
}

const recordActivity = async (activity, user) => {
  return await post(activityEndpoint, activity, user)
}

module.exports = {
  getActivities,
  getActivityById,
  recordActivity
}
