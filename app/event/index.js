const { SOURCE } = require('../constants/event/source')
const { ADD } = require('../constants/event/events')
const { sendEvent } = require('./send-event')

const send = async (id, data) => {
  const event = {
    source: SOURCE,
    type: ADD,
    id,
    data
  }

  await sendEvent(event)
}

module.exports = {
  send
}