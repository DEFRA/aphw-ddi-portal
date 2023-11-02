const isInRole = require('./is-in-role')
const { admin } = require('./permissions')

const mapAuth = (request) => {
  return {
    isAuthenticated: request.auth.isAuthenticated,
    isAnonymous: !request.auth.isAuthenticated,
    isAdminUser: request.auth.isAuthenticated && isInRole(request.auth.credentials, admin)
  }
}

module.exports = mapAuth
