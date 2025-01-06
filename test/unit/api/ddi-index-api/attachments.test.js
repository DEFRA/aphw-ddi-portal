jest.mock('../../../../app/api/ddi-index-api/base')
const { post } = require('../../../../app/api/ddi-index-api/base')

const { testAttachmentFile } = require('../../../../app/api/ddi-index-api/attachments')
const { user } = require('../../../mocks/auth')

describe('DDI API attachments', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls an attachment test', async () => {
    post.mockResolvedValue({
      statusCode: 200
    })

    const fileInfo = { filename: 'test-file.pdf' }
    const fieldData = { index_number: 'ED12345' }

    const res = await testAttachmentFile(fileInfo, fieldData, user)

    expect(res).toEqual({ statusCode: 200 })
    expect(post).toHaveBeenCalledWith('attachments/test', { fileInfo, fieldData }, user)
  })
})
