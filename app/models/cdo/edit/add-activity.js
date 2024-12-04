const { errorPusherDefault } = require('../../../lib/error-helpers')

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
      classes: 'defra-responsive-!-font-size-16',
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

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
