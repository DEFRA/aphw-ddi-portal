const { get } = require('./base')

const exportEndpoint = 'export'
const triggerOvernightEndpoint = 'trigger-overnight'

const exportData = async (user) => {
  const payload = await get(exportEndpoint, user)

  return payload.csv
}

const triggerOvernight = async (user) => {
  const payload = await get(triggerOvernightEndpoint, user)

  return payload
}

module.exports = {
  exportData,
  triggerOvernight
}
