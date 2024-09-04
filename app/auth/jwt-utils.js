const jwt = require('jsonwebtoken')
const config = require('../config')

const generateToken = (payload, { audience, issuer }) => {
  const secretKey = config.authConfig.secret
  const options = {
    expiresIn: '1h',
    algorithm: 'HS256',
    audience,
    issuer
  }

  return jwt.sign(payload, secretKey, options)
}

const createJwtToken = (audience) => (username, displayname, scopes) => {
  const options = {
    audience,
    issuer: 'aphw-ddi-portal'
  }

  return generateToken({
    scopes,
    username,
    displayname
  }, options)
}

const createBearerHeader = (audience) => (user, request) => {
  const username = user?.username
  const displayname = user?.displayname
  const scopes = request.auth?.credentials?.scope
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
