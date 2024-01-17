const { v4: uuidv4 } = require('uuid')

const createMessage = (event) => {
  const { type, source, id, subject = undefined, data = undefined } = event
  return {
    body: {
      specversion: '1.0',
      type,
      source,
      id,
      time: new Date().toISOString(),
      subject,
      datacontenttype: 'text/json',
      data
    },
    type,
    source
  }
}

module.exports = {
  createMessage
}
