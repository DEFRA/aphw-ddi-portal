const { get, post, callDelete } = require('./base')
const { keys, sources } = require('../../constants/cdo/activity')
const { ApiConflictError } = require('../../errors/api-conflict-error')
const { getDogOwner } = require('./dog')

const activitiesEndpoint = 'activities'
const activityEndpoint = 'activity'

const hideTheseLabels = ['Application pack', 'Form 2']

/**
 *
 * @param activityType
 * @param activitySource
 * @param user
 * @param hideInternal
 * @return {Promise<T[]|string|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|{activity_type: {name: string}, id: number, label: string}|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|*>}
 */
const getActivities = async (activityType, activitySource, user, hideInternal = false) => {
  const payload = await get(`${activitiesEndpoint}/${activityType}/${activitySource}`, user)

  if (hideInternal) {
    return payload.activities.filter(act => !hideTheseLabels.includes(act.label) || act.activity_type.name === keys.received)
  }

  return payload.activities
}

/**
 *
 * @param user
 * @return {Promise<{dogReceived: (*|string|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|{activity_type: {name: string}, id: number, label: string}|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]), ownerReceived: (*|string|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|{activity_type: {name: string}, id: number, label: string}|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]), ownerSent: (*|string|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|{activity_type: {name: string}, id: number, label: string}|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]), dogSent: (*|string|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|{activity_type: {name: string}, id: number, label: string}|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}]|[{activity_type: {name: string}, id: number, label: string},{activity_type: {name: string}, id: number, label: string}])}>}
 */
const getAllActivities = async (user) => {
  return {
    dogSent: await getActivities(keys.sent, sources.dog, user),
    dogReceived: await getActivities(keys.received, sources.dog, user),
    ownerSent: await getActivities(keys.sent, sources.owner, user),
    ownerReceived: await getActivities(keys.received, sources.owner, user)
  }
}

/**
 *
 * @param activityId
 * @param user
 * @return {Promise<*>}
 */
const getActivityById = async (activityId, user) => {
  const payload = await get(`${activityEndpoint}/${activityId}`, user)

  return payload.activity
}

/**
 *
 * @param activity
 * @param user
 * @return {Promise<undefined|*>}
 */
const recordActivity = async (activity, user) => {
  const activityEntity = await getActivityById(activity.activity, user)
  activity.targetPk = activityEntity.activity_event?.target_primary_key

  if (activity.targetPk !== activity.source && activity.targetPk === 'owner') {
    activity.pk = (await getDogOwner(activity.pk, user)).personReference
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
 * @param user
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
