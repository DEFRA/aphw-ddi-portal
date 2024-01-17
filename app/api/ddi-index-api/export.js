const { get } = require('./base')

const exportEndpoint = 'export'

const options = {
  json: true
}

const exportData = async (user) => {
  const payload = await get(exportEndpoint, options, user)

  return payload.csv
}

module.exports = {
  exportData
}
