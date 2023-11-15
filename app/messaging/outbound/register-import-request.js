const { v4: uuidv4 } = require('uuid')

const createMessage = (data) => ({
  body: {
    specVersion: '1.0',
    type: 'REGISTER_IMPORT',
    source: 'aphw-ddi-portal',
    id: uuidv4(),
    time: new Date().toISOString(),
    subject: 'RegisterImport',
    dataContentType: 'text/json',
    data
  }
})

module.exports = {
  createMessage
}
