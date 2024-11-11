const { purgeSoftDelete, neuteringDeadline, expiredInsurance } = require('../../../../app/api/ddi-index-api/jobs')
const { post } = require('../../../../app/api/ddi-index-api/base')
const { userForAuth } = require('../../../mocks/auth')
jest.mock('../../../../app/api/ddi-index-api/base')

describe('Jobs tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('purgeSoftDelete calls endpoint', async () => {
    post.mockResolvedValue({ payload: {} })
    await purgeSoftDelete(userForAuth)
    expect(post).toHaveBeenCalledWith('jobs/purge-soft-delete', {}, userForAuth)
  })

  test('purgeSoftDelete calls endpoint with param', async () => {
    post.mockResolvedValue({ payload: {} })
    await purgeSoftDelete(userForAuth, '2010-06-20')
    expect(post).toHaveBeenCalledWith('jobs/purge-soft-delete?today=2010-06-20', {}, userForAuth)
  })

  test('neuteringDeadline calls endpoint', async () => {
    post.mockResolvedValue({ payload: {} })
    await neuteringDeadline(null, userForAuth)
    expect(post).toHaveBeenCalledWith('jobs/neutering-deadline', {}, userForAuth)
  })

  test('neuteringDeadline calls endpoint with param', async () => {
    post.mockResolvedValue({ payload: {} })
    await neuteringDeadline('2010-06-20', userForAuth)
    expect(post).toHaveBeenCalledWith('jobs/neutering-deadline?today=2010-06-20', {}, userForAuth)
  })

  test('expiredInsurance calls endpoint', async () => {
    post.mockResolvedValue({ payload: {} })
    await expiredInsurance(null, userForAuth)
    expect(post).toHaveBeenCalledWith('jobs/expired-insurance', {}, userForAuth)
  })

  test('expiredInsurance calls endpoint with param', async () => {
    post.mockResolvedValue({ payload: {} })
    await expiredInsurance('2010-06-20', userForAuth)
    expect(post).toHaveBeenCalledWith('jobs/expired-insurance?today=2010-06-20', {}, userForAuth)
  })
})
