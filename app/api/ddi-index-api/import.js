const { post } = require('./base')

const importEndpoint = 'robot-import'

const doImport = async (filename, stage, user) => {
  const res = await post(`${importEndpoint}`, { filename, stage }, user)

  return res
}

module.exports = {
  doImport
}
