function ViewModel (cookiesPolicy = {}, updated = false) {
  this.analytics = {
    idPrefix: 'analytics',
    name: 'analytics',
    fieldset: {
      legend: {
        text: 'Do you want to accept cookies that measure website use?',
        classes: 'govuk-fieldset__legend--s'
      }
    },
    items: [
      {
        value: true,
        text: 'Yes',
        checked: cookiesPolicy.analytics
      },
      {
        value: false,
        text: 'No',
        checked: !cookiesPolicy.analytics
      }
    ]
  }

  this.updated = updated
}

module.exports = ViewModel
