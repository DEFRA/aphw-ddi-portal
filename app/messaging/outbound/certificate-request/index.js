const { MessageSender } = require('ffc-messaging')
const { certificateRequestQueue } = require('../../../config/messaging/certificate-request-queue')
const { createMessage } = require('./certificate-request')

const sendMessage = async (data) => {
  const certificateRequestSender = new MessageSender(certificateRequestQueue)

  const message = createMessage(data)

  console.log('message', message)
  await certificateRequestSender.sendMessage(message)
  await certificateRequestSender.closeConnection()

  return message.body.certificateId
}

module.exports = {
  sendMessage
}
