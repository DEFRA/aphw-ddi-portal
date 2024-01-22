const { MessageSender } = require('ffc-messaging')
const { importRequestQueue } = require('../../../config/messaging/import-queue')
const { createMessage } = require('./register-import-request')

const sendMessage = async (data) => {
  const importRequestSender = new MessageSender(importRequestQueue)

  const message = createMessage(data)

  await importRequestSender.sendMessage(message)
  await importRequestSender.closeConnection()
}

module.exports = {
  sendMessage
}
