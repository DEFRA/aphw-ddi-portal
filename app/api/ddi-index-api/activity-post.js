const { post } = require('./base')
const { getDogOwner } = require('./dog')
const { getActivityById } = require('./activity-get')

const activityEndpoint = 'activity'

const recordActivity = async (activity, user) => {
  console.log('here1', activity)
  const activityEntity = await getActivityById(activity.activity)
  activity.targetPk = activityEntity.activity_event?.target_primary_key

  console.log('here2', activity)
  if (activity.targetPk !== activity.source && activity.targetPk === 'owner') {
    activity.pk = (await getDogOwner(activity.pk)).personReference
  }
  console.log('here3', activity)

  return await post(activityEndpoint, activity, user)
}

module.exports = {
  recordActivity
}
