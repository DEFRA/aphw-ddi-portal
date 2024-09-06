const { user } = require('../../../mocks/auth')
const { ApiConflictError } = require('../../../../app/errors/api-conflict-error')
const { getActivities, getActivityById, recordActivity, getAllActivities, addActivity, deleteActivity } = require('../../../../app/api/ddi-index-api/activities')
const { get, post, callDelete } = require('../../../../app/api/ddi-index-api/base')
jest.mock('../../../../app/api/ddi-index-api/base')

const { getDogOwner } = require('../../../../app/api/ddi-index-api/dog')
jest.mock('../../../../app/api/ddi-index-api/dog')

describe('Activity test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getActivities calls endpoint', async () => {
    get.mockResolvedValue({ payload: {} })
    await getActivities('activityType', 'activitySource', user)
    expect(get).toHaveBeenCalledWith('activities/activityType/activitySource', user)
  })

  test('getActivityById calls endpoint', async () => {
    get.mockResolvedValue({ payload: {} })
    await getActivityById('activityId', user)
    expect(get).toHaveBeenCalledWith('activity/activityId', user)
  })

  test('recordActivity calls endpoint', async () => {
    get.mockResolvedValue({ activity: { activity_event: { target_primary_key: 'dog' } } })
    post.mockResolvedValue(123)
    await recordActivity({ activity: 123, source: 'dog', activityType: 'sent', targetPk: 'dog' }, user)
    expect(post).toHaveBeenCalledWith('activity', {
      activity: 123,
      activityType: 'sent',
      source: 'dog',
      targetPk: 'dog'
    }, user)
  })

  test('recordActivity calls endpoint with alternative pk', async () => {
    get.mockResolvedValue({ activity: { activity_event: { target_primary_key: 'owner' } } })
    post.mockResolvedValue(123)
    getDogOwner.mockResolvedValue({ personReference: 'P-123-456' })
    await recordActivity({ activity: 123, source: 'dog', activityType: 'sent', targetPk: 'dog' }, user)
    expect(post).toHaveBeenCalledWith('activity', {
      activity: 123,
      activityType: 'sent',
      source: 'dog',
      targetPk: 'owner',
      pk: 'P-123-456'
    }, user)
  })

  test('getAllActivities calls correct endpoints', async () => {
    get.mockResolvedValue({ payload: {} })
    await getAllActivities(user)
    expect(get).toHaveBeenCalledTimes(4)
    expect(get.mock.calls[0]).toEqual(['activities/sent/dog', user])
    expect(get.mock.calls[1]).toEqual(['activities/received/dog', user])
    expect(get.mock.calls[2]).toEqual(['activities/sent/owner', user])
    expect(get.mock.calls[3]).toEqual(['activities/received/owner', user])
  })

  test('addActivity calls correct endpoint', async () => {
    post.mockResolvedValue({ payload: {} })
    await addActivity({ label: 'Activity 1', activityType: 'sent', activitySource: 'dog' }, user)
    expect(post).toHaveBeenCalledWith('activities', { activitySource: 'dog', activityType: 'sent', label: 'Activity 1' }, user)
  })

  test('addActivity catches boom', async () => {
    post.mockRejectedValue({
      isBoom: true,
      output: {
        statusCode: 409,
        payload: {
          statusCode: 409,
          error: 'Conflict',
          message: 'Response Error: 409 Conflict'
        },
        headers: {}
      }
    })

    await expect(addActivity({ label: 'Activity 1', activityType: 'sent', activitySource: 'dog' }, user)).rejects.toThrow(new ApiConflictError({ message: 'This activity name is already listed' }))
  })

  test('should throw a normal error given there is an error code other than 409', async () => {
    post.mockRejectedValue(new Error('server error'))

    await expect(addActivity({ label: 'Activity 1', activityType: 'sent', activitySource: 'dog' }, user)).rejects.toThrow(new Error('server error'))
  })

  test('deleteActivity calls correct endpoint', async () => {
    callDelete.mockResolvedValue({ payload: {} })
    await deleteActivity(123, user)
    expect(callDelete).toHaveBeenCalledWith('activities/123', user)
  })
})
