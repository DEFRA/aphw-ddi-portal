const { keys } = require('../../constants/admin')

const getOrphanedOwnersForDeletion = (request) => {
  return request.yar?.get(`${keys.orphanedOwners}`) || []
}

const setOrphanedOwnersForDeletion = (request, value) => {
  request.yar.set(`${keys.orphanedOwners}`, typeof value === 'string' ? [value] : value || [])
}

const consumeOrphanedOwnersForDeletion = (request) => {
  const orphanedOwnersForDeletion = getOrphanedOwnersForDeletion(request)
  setOrphanedOwnersForDeletion(request, [])

  return orphanedOwnersForDeletion
}

module.exports = {
  getOrphanedOwnersForDeletion,
  setOrphanedOwnersForDeletion,
  consumeOrphanedOwnersForDeletion
}
