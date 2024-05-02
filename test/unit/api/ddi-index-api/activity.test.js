const { user } = require('../../../mocks/auth')
const { getActivities, getActivityById, recordActivity, getAllActivities } = require('../../../../app/api/ddi-index-api/activities')
const { get, post } = require('../../../../app/api/ddi-index-api/base')
jest.mock('../../../../app/api/ddi-index-api/base')

const { getDogOwner } = require('../../../../app/api/ddi-index-api/dog')
jest.mock('../../../../app/api/ddi-index-api/dog')

describe('Activity test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getActivities calls endpoint', async () => {
    get.mockResolvedValue({ payload: {} })
    await getActivities('activityType', 'activitySource')
    expect(get).toHaveBeenCalledWith('activities/activityType/activitySource')
  })

  test('getActivityById calls endpoint', async () => {
    get.mockResolvedValue({ payload: {} })
    await getActivityById('activityId')
    expect(get).toHaveBeenCalledWith('activity/activityId')
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
    await getAllActivities()
    expect(get).toHaveBeenCalledTimes(4)
    expect(get.mock.calls[0]).toEqual(['activities/sent/dog'])
    expect(get.mock.calls[1]).toEqual(['activities/received/dog'])
    expect(get.mock.calls[2]).toEqual(['activities/sent/owner'])
    expect(get.mock.calls[3]).toEqual(['activities/received/owner'])
  })
})
