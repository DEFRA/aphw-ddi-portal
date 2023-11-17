const { v4: uuidv4 } = require('uuid')

const createMessage = (data) => ({
  body: {
    specVersion: '1.0',
    id: uuidv4(),
    time: new Date().toISOString(),
    subject: 'RegisterImport',
    dataContentType: 'text/json',
    data
  },
  type: 'REGISTER_IMPORT',
  source: 'aphw-ddi-portal',
})

module.exports = {
  createMessage
}
