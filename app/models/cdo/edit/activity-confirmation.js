function ViewModel (model) {
  this.model = {
    message: model.message,
    returnLink: model.returnLink,
    sourceDescription: model.sourceDescription,
    source: model.source
  }
}

module.exports = ViewModel
