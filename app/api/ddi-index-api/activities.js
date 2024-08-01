const { get, post, callDelete } = require('./base')
const { keys, sources } = require('../../constants/cdo/activity')
const { ApiConflictError } = require('../../errors/api-conflict-error')
const { getDogOwner } = require('./dog')

const activitiesEndpoint = 'activities'
const activityEndpoint = 'activity'

const hideTheseLabels = ['Application pack', 'Form 2']

const getActivities = async (activityType, activitySource, hideInternal = false) => {
  const payload = await get(`${activitiesEndpoint}/${activityType}/${activitySource}`)

  if (hideInternal) {
    return payload.activities.filter(act => !hideTheseLabels.includes(act.label) || act.activity_type.name === keys.received)
  }

  return payload.activities
}

const getAllActivities = async () => {
  return {
    dogSent: await getActivities(keys.sent, sources.dog),
    dogReceived: await getActivities(keys.received, sources.dog),
    ownerSent: await getActivities(keys.sent, sources.owner),
    ownerReceived: await getActivities(keys.received, sources.owner)
  }
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

/**
 * @typedef ActivityRequest
 * @property {string} label
 * @property {string} activityType
 * @property {string} activitySource
 */

/**
 * @param {ActivityRequest} activity
 * @return {Promise<ActivityRequest>}
 */
const addActivity = async (activity, user) => {
  const data = {
    label: activity.label,
    activityType: activity.activityType,
    activitySource: activity.activitySource
  }

  try {
    const payload = await post(activitiesEndpoint, data, user)

    return payload
  } catch (e) {
    if (e.isBoom && e.output.statusCode === 409) {
      throw new ApiConflictError({
        ...e,
        message: 'This activity name is already listed'
      })
    }
    throw e
  }
}

const deleteActivity = async (activityId, user) => {
  await callDelete(`${activitiesEndpoint}/${activityId}`, user)
}

module.exports = {
  getActivities,
  getAllActivities,
  getActivityById,
  recordActivity,
  addActivity,
  deleteActivity
}
