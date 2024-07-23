const { purgeSoftDelete, neuteringDeadline } = require('../../../../app/api/ddi-index-api/jobs')
const { post } = require('../../../../app/api/ddi-index-api/base')
jest.mock('../../../../app/api/ddi-index-api/base')

describe('Jobs tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('purgeSoftDelete calls endpoint', async () => {
    post.mockResolvedValue({ payload: {} })
    await purgeSoftDelete()
    expect(post).toHaveBeenCalledWith('jobs/purge-soft-delete')
  })

  test('purgeSoftDelete calls endpoint with param', async () => {
    post.mockResolvedValue({ payload: {} })
    await purgeSoftDelete('2010-06-20')
    expect(post).toHaveBeenCalledWith('jobs/purge-soft-delete?today=2010-06-20')
  })

  test('neuteringDeadline calls endpoint', async () => {
    post.mockResolvedValue({ payload: {} })
    await neuteringDeadline()
    expect(post).toHaveBeenCalledWith('jobs/neutering-deadline')
  })

  test('neuteringDeadline calls endpoint with param', async () => {
    post.mockResolvedValue({ payload: {} })
    await neuteringDeadline('2010-06-20')
    expect(post).toHaveBeenCalledWith('jobs/neutering-deadline?today=2010-06-20')
  })
})
