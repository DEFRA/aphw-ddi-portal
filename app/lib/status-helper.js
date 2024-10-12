const getNewStatusLabel = (status) => {
  let newStatus = 'unknown'
  switch (status) {
    case 'Pre-exempt':
      newStatus = 'Applying for exemption'
      break
    case 'Failed':
      newStatus = 'Failed to exempt dog'
      break
    case 'Withdrawn':
      newStatus = 'Withdrawn by owner'
      break
    default:
      newStatus = status
  }
  return newStatus
}

module.exports = {
  getNewStatusLabel
}
