const { user } = require('../../mocks/auth')
const { v4: uuidv4 } = require('uuid')

jest.mock('../../../app/api/ddi-index-api/attachments')
const { testAttachmentFile } = require('../../../app/api/ddi-index-api/attachments')

jest.mock('../../../app/storage/repos/download-blob')
const { downloadBlob } = require('../../../app/storage/repos/download-blob')

jest.mock('../../../app/storage/repos/blob')
const { deleteFile } = require('../../../app/storage/repos/blob')

const { testTemplateFile } = require('../../../app/lib/template-helper')

describe('template helper', () => {
  test('should handle error', async () => {
    const sourceFilename = 'test0file1.pdf'
    const fieldData = { index_number: 'ED12345' }
    testAttachmentFile.mockResolvedValue({ status: 'error', message: 'error message 1' })
    await expect(testTemplateFile(sourceFilename, fieldData, user)).rejects.toThrow('Error during template test: error message 1')
  })

  test('should download result', async () => {
    const sourceFilename = 'test0file1.pdf'
    const fieldData = { index_number: 'ED12345' }
    testAttachmentFile.mockResolvedValue({ status: 'ok' })
    downloadBlob.mockResolvedValue('Some pdf content')
    deleteFile.mockResolvedValue()
    const guid1 = uuidv4()
    const pdf = await testTemplateFile(sourceFilename, fieldData, user, guid1)
    expect(pdf).toBe('Some pdf content')
    expect(deleteFile).toHaveBeenCalledWith('attachments', `temp-populations/${guid1}.pdf`)
  })
  test('should add postal address', async () => {
    const sourceFilename = 'post-folder/test0file1.pdf'
    const fieldData = {
      ddi_index_number: 'ED12345',
      ddi_owner_name: 'John Smith',
      ddi_address_line_1: 'addr1',
      ddi_postcode: 'postcode'
    }
    testAttachmentFile.mockResolvedValue({ status: 'ok' })
    downloadBlob.mockResolvedValue('Some pdf content')
    deleteFile.mockResolvedValue()
    const guid1 = uuidv4()
    const pdf = await testTemplateFile(sourceFilename, fieldData, user, guid1)
    expect(pdf).toBe('Some pdf content')
    expect(deleteFile).toHaveBeenCalledWith('attachments', `temp-populations/${guid1}.pdf`)
    expect(testAttachmentFile).toHaveBeenCalledWith({
      fileGuid: expect.anything(),
      filename: 'post-folder/test0file1.pdf',
      flattenPdf: true,
      saveFile: true
    },
    {
      ddi_postal_name_and_address: 'John Smith\naddr1\npostcode',
      ddi_index_number: 'ED12345',
      ddi_owner_name: 'John Smith',
      ddi_address_line_1: 'addr1',
      ddi_postcode: 'postcode'
    },
    expect.anything()
    )
  })
})
