const { keys } = require('../../constants/admin')

const getOrphanedOwnersForDeletion = (request) => {
  return request.yar?.get(`${keys.orphanedOwners}`) || []
}

const setOrphanedOwnersForDeletion = (request, value) => {
  request.yar.set(`${keys.orphanedOwners}`, typeof value === 'string' ? [value] : value || [])
}

const initialiseOwnersForDeletion = (request, owners) => {
  setOrphanedOwnersForDeletion(request, owners.map(owner => owner.personReference))
}

module.exports = {
  getOrphanedOwnersForDeletion,
  setOrphanedOwnersForDeletion,
  initialiseOwnersForDeletion
}
