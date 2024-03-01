const { flatMapActivityDtoToCheckActivityRow } = require('../../mappers/check-activities')

function ViewModel (entity, activities, backNav) {
  const mappedActivities = flatMapActivityDtoToCheckActivityRow(activities)

  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    pk: entity.pk,
    source: entity.source,
    entityTitle: entity.title,
    events: mappedActivities
  }
}

module.exports = ViewModel
