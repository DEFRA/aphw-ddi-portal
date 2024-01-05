const { get } = require('./base')

const exportEndpoint = 'export'

const options = {
  json: true
}

const exportData = async () => {
  const payload = await get(exportEndpoint, options)

  return payload.csv
}

module.exports = {
  exportData
}
