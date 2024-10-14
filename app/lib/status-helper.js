const { inactiveSubStatuses } = require('../constants/cdo/status')

const getNewStatusLabel = (dog) => {
  switch (dog.status) {
    case 'Pre-exempt':
      return 'Applying for exemption'
    case 'Failed':
      return 'Failed to exempt dog'
    case 'Withdrawn':
      return 'Withdrawn by owner'
    case 'Inactive':
      if (dog.death_date || dog.dateOfDeath) {
        return inactiveSubStatuses.dead
      } else if (dog.exported_date || dog.dateExported) {
        return inactiveSubStatuses.exported
      } else if (dog.stolen_date || dog.dateStolen) {
        return inactiveSubStatuses.stolen
      } else if (dog.untraceable_date || dog.dateUntraceable) {
        return inactiveSubStatuses.untraceable
      }
      return dog.status
    default:
      return dog.status
  }
}

module.exports = {
  getNewStatusLabel
}
