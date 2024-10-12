const getNewStatusLabel = (status) => {
  switch (status) {
    case 'Pre-exempt':
      return 'Applying for exemption'
    case 'Failed':
      return 'Failed to exempt dog'
    case 'Withdrawn':
      return 'Withdrawn by owner'
    default:
      return status
  }
}

module.exports = {
  getNewStatusLabel
}
