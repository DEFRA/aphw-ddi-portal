const { get } = require('./index')

const entryKey = 'verificationPayload'
const getVerificationPayload = (request) => {
  return get(request, entryKey)
}
const setVerificationPayload = (request, verificationPayloadData) => {
  request.yar.set(entryKey, verificationPayloadData)
}

module.exports = {
  getVerificationPayload,
  setVerificationPayload
}
