function ViewModel (activity, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: activity.srcHashParam,
    pk: activity.pk,
    source: activity.source,
    titleReference: activity.titleReference,
    activityType: {
      id: 'activityType',
      name: 'activityType',
      classes: 'govuk-!-font-size-16',
      value: activity.activityType,
      items: [
        {
          text: 'We\'ve sent something',
          value: 'sent'
        },
        {
          text: 'We\'ve received something',
          value: 'received'
        }
      ]
    },
    errors: []
  }

  if (errors) {
    for (const error of errors.details) {
      const name = error.path[0] ?? error.context.path[0]
      const prop = this.model[name]

      if (prop) {
        prop.errorMessage = { text: error.message }
        this.model.errors.push({ text: error.message, href: `#${name}` })
      }
    }
  }
}

module.exports = ViewModel
