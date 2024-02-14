const { routes } = require('../../../constants/cdo/dog')
const { keys } = require('../../../constants/cdo/activity')

function ViewModel (model, backNav, errors) {
  this.model = {
    formAction: routes.selectActivity.post,
    backLink: backNav.backLink,
    editLink: model.editLink,
    pk: model.pk,
    srcHashParam: model.srcHashParam,
    source: model.source,
    activityType: model.activityType,
    activityTitle: determineActivityTitle(model.activityType),
    activityDateTitle: determineActivityDateTitle(model.activityType),
    activity: {
      id: 'activity',
      name: 'activity',
      classes: 'govuk-!-font-size-16',
      value: model[keys.activity],
      items: model.activityList.map(a => ({
        text: a.label,
        value: a.id
      }))
    },
    activityDate: {
      type: 'date',
      id: 'activityDate',
      namePrefix: 'activityDate',
      classes: 'govuk-!-font-size-16',
      fieldset: {
        legend: {
          text: determineActivityDateTitle(model.activityType),
          classes: 'govuk-fieldset__legend govuk-fieldset__legend--m'
        }
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2 govuk-!-font-size-16',
          value: model[`${keys.activityDate}-day`],
          attributes: { maxlength: '2' }
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2 govuk-!-font-size-16',
          value: model[`${keys.activityDate}-month`],
          attributes: { maxlength: '2' }
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4 govuk-!-font-size-16',
          value: model[`${keys.activityDate}-year`],
          attributes: { maxlength: '4' }
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

const determineActivityTitle = activityType => {
  return activityType === 'sent' ? 'What have we sent?' : 'What have we received?'
}

const determineActivityDateTitle = activityType => {
  return activityType === 'sent' ? 'When did we send it?' : 'When did we receive it?'
}

module.exports = ViewModel