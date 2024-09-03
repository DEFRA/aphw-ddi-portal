const jwt = require('jsonwebtoken')
const config = require('../config')
const generateToken = (payload) => {
  const secretKey = config.authConfig.secret
  const options = {
    expiresIn: '1h'
  }

  const token = jwt.sign(payload, secretKey, options)
  return token
}

module.exports = {
  generateToken
}
