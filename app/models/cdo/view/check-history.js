const { flatMapActivityDtoToCheckActivityRow } = require('../../mappers/check-history')

function ViewModel (entity, activities, backNav) {
  const mappedActivities = flatMapActivityDtoToCheckActivityRow(activities)

  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    pk: entity.pk,
    source: entity.source,
    entityTitle: entity.title,
    pageTitle: entity.pageTitle,
    events: mappedActivities
  }
}

module.exports = ViewModel
