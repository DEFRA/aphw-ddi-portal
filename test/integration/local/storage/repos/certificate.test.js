describe('certificate template repo', () => {
  const { blobConfig } = require('../../../../../app/config')
  const { blobServiceClient } = require('../../../../../app/storage/get-blob-client')

  const seedCertificate = async () => {
    const container = blobServiceClient.getContainerClient(blobConfig.certificateContainer)

    await container.createIfNotExists()

    const templateClient = container.getBlockBlobClient('ED1234/fbab4d37-9614-4db1-b66a-1b562f69ba4d.pdf')
    const template = Buffer.from('{ "hello": "world" }')
    await templateClient.upload(template, template.length)
  }

  afterEach(async () => {
    const container = blobServiceClient.getContainerClient(blobConfig.certificateContainer)

    const exists = await container.exists()

    if (exists) {
      await blobServiceClient.deleteContainer(blobConfig.certificateContainer)
    }

    jest.clearAllMocks()
    jest.resetModules()
  })

  test('should get certificate template', async () => {
    const { downloadCertificate } = require('../../../../../app/storage/repos/certificate')

    await seedCertificate()

    const cert = downloadCertificate('ED1234', 'fbab4d37-9614-4db1-b66a-1b562f69ba4d')

    await expect(cert).resolves.toEqual(Buffer.from('{ "hello": "world" }'))
  })

  test('should throw error if exemption template does not exist', async () => {
    const { downloadCertificate } = require('../../../../../app/storage/repos/certificate')

    await expect(downloadCertificate('ED1234', 'fbab4d37-9614-4db1-b66a-1b562f69ba4d')).rejects.toThrow('Certificate \'ED1234/fbab4d37-9614-4db1-b66a-1b562f69ba4d.pdf\' does not exist')
  })
})
