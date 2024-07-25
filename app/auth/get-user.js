const getUser = (request) => {
  console.log(`getUser ${new Date()}`, request.auth.credentials)
  return {
    userId: request.auth.credentials.account.homeAccountId,
    displayname: request.auth.credentials.account.name,
    username: request.auth.credentials.account.username
  }
}

module.exports = getUser
