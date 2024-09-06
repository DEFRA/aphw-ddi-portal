const getUser = (request) => {
  return {
    userId: request.auth.credentials.account.homeAccountId,
    displayname: request.auth.credentials.account.name,
    username: request.auth.credentials.account.username,
    scopes: request.auth.credentials.scope
  }
}

module.exports = getUser
