const { get } = require('./base')

const documentationEndpoint = 'swagger.json'
const getDocumentation = async () => {
  const payload = await get(documentationEndpoint, {
    json: true
  })

  return payload
}

module.exports = {
  getDocumentation
}
