const { mapActivityDtoToCheckActivityRow } = require('../../mappers/check-activities')

function ViewModel (cdo, activities, backNav) {
  const mappedActivities = activities.map(mapActivityDtoToCheckActivityRow)

  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    dog: {
      indexNumber: cdo.dog.indexNumber
    },
    events: mappedActivities
  }
}

module.exports = ViewModel
