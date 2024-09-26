const { get } = require('./base')

const prepopCodesEndpoint = 'prepop-codes'

const prepopCodes = async (user) => {
  await get(prepopCodesEndpoint, user)
}

module.exports = {
  prepopCodes
}
