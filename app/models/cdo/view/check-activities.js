const { flatMapActivityDtoToCheckActivityRow } = require('../../mappers/check-activities')

function ViewModel (cdo, activities, backNav) {
  console.log('~~~~~~ Chris Debug ~~~~~~ ', 'Activities', JSON.stringify(activities))
  const mappedActivities = flatMapActivityDtoToCheckActivityRow(activities)

  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    pk: cdo.pk,
    source: cdo.source,
    events: mappedActivities
  }
}

module.exports = ViewModel
