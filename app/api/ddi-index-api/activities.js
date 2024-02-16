const { get, post } = require('./base')
const { getDogOwner } = require('./dog')

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
  const activityEntity = await getActivityById(activity.activity)
  activity.targetPk = activityEntity.activity_event?.target_primary_key

  if (activity.targetPk !== activity.source && activity.targetPk === 'owner') {
    activity.pk = (await getDogOwner(activity.pk)).personReference
  }

  return await post(activityEndpoint, activity, user)
}

module.exports = {
  getActivities,
  getActivityById,
  recordActivity
}
