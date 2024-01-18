const { get } = require('./base')

const exportEndpoint = 'export'

const exportData = async (user) => {
  const payload = await get(exportEndpoint, user)

  return payload.csv
}

module.exports = {
  exportData
}
