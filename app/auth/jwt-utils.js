const jwt = require('jsonwebtoken')
const config = require('../config')

const generateToken = (payload, { audience, issuer }) => {
  const privateKey = Buffer.from(config.authConfig.privateKey, 'base64').toString()

  const options = {
    expiresIn: '1h',
    algorithm: 'RS256',
    audience,
    issuer,
    keyid: issuer
  }

  return jwt.sign(payload, privateKey, options)
}

const createJwtToken = (audience) => (username, displayname, scopes) => {
  const options = {
    audience,
    issuer: 'aphw-ddi-portal'
  }

  return generateToken({
    scope: scopes,
    username,
    displayname
  }, options)
}

const createBearerHeader = (audience) => (user) => {
  const username = user?.username
  const displayname = user?.displayname
  const scopes = user?.scopes
  const token = createJwtToken(audience)(username, displayname, scopes)

  return {
    Authorization: `Bearer ${token}`
  }
}

module.exports = {
  generateToken,
  createJwtToken,
  createBearerHeader
}
