function ViewModel(errors) {
  console.log(errors)
  this.model = {
    id: 'registerUpload',
    name: 'register',
    label: {
      text: 'Choose file',
      classes: 'govuk-visually-hidden'
    }
  }

  if (errors) {
    this.model.errorMessage = {
      text: errors.details[0].message
    }
  }
}

module.exports = ViewModel
