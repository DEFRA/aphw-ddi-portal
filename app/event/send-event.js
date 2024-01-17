const { MessageSender } = require('ffc-messaging')
const { event } = require('../config/messaging/event')
const { createMessage } = require('./create-message')
const { validateEvent } = require('./validate-event')

const sendEvent = async (data) => {
  if (validateEvent(data)) {
    const message = createMessage(data)
    const eventSender = new MessageSender(event)
    await eventSender.sendMessage(message)
    await eventSender.closeConnection()
  }
}

module.exports = {
  sendEvent
}
