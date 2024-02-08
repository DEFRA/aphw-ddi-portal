function ViewModel (model, backNav) {
  this.model = {
    indexNumber: model.indexNumber,
    message: model.message,
    activityType: model.activityType
  }
}

module.exports = ViewModel
