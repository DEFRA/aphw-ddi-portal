const { get } = require('./base')

const prepopCodesEndpoint = 'prepop-codes'

const prepopCodes = async () => {
  await get(prepopCodesEndpoint)
}

module.exports = {
  prepopCodes
}
