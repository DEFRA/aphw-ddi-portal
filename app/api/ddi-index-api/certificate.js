const { post } = require('./base')

const certificateEndpoint = 'certificate'

const generateCertificate = async (indexNumber) => {
  const res = await post(certificateEndpoint, { indexNumber })

  return res
}

module.exports = {
  generateCertificate
}
