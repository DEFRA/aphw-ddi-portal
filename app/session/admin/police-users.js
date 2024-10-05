const { keys } = require('../../constants/admin')

const getPoliceUsersToAdd = (request) => {
  return request.yar?.get(`${keys.policeUsers}`) || []
}

const setPoliceUsersToAdd = (request, value) => {
  request.yar.set(`${keys.policeUsers}`, typeof value === 'string' ? [value] : value || [])
}

const appendPoliceUserToAdd = (request, value) => {
  const currentUsers = getPoliceUsersToAdd(request)
  const newUserList = typeof value === 'string' ? [value] : value || []

  setPoliceUsersToAdd(request, [...currentUsers, ...newUserList])
}

const initialisePoliceUsers = (request) => {
  setPoliceUsersToAdd(request, [])
}

module.exports = {
  getPoliceUsersToAdd,
  setPoliceUsersToAdd,
  appendPoliceUserToAdd,
  initialisePoliceUsers
}
