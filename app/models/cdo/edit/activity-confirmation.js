function ViewModel (model) {
  this.model = {
    message: model.message,
    returnLink: model.returnLink,
    sourceDescription: model.sourceDescription,
    source: model.source,
    activityLink: model.activityLink
  }
}

module.exports = ViewModel
