const { get } = require('./base')

const activitiesEndpoint = 'activities'
const activityEndpoint = 'activity'

const getActivities = async (activityType) => {
  const payload = await get(`${activitiesEndpoint}/${activityType}`)

  return payload.activities
}

const getActivityById = async (activityId) => {
  const payload = await get(`${activityEndpoint}/${activityId}`)

  return payload.activity
}

module.exports = {
  getActivities,
  getActivityById
}
