const { routes } = require('../../../constants/cdo/dog')
const { keys } = require('../../../constants/cdo/dog')
const { addDateErrors } = require('../../../lib/date-helpers')

function ViewModel (dogDetails, errors) {
  this.model = {
    backLink: routes.confirm.get,
    dogId: dogDetails.dogId,
    applicationType: {
      id: 'applicationType',
      name: 'applicationType',
      value: dogDetails[keys.applicationType],
      items: []
    },
    cdoIssued: {
      type: 'date',
      id: 'cdoIssued',
      namePrefix: 'cdoIssued',
      fieldset: {
        legend: {
          text: 'New CDO Issue Date',
          classes: 'govuk-fieldset__legend--s'
        }
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2',
          value: dogDetails[`${keys.cdoIssued}-day`],
          attributes: { maxlength: '2' }
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2',
          value: dogDetails[`${keys.cdoIssued}-month`],
          attributes: { maxlength: '2' }
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4',
          value: dogDetails[`${keys.cdoIssued}-year`],
          attributes: { maxlength: '4' }
        }
      ]
    },
    interimExemption: {
      type: 'date',
      id: 'interimExemption',
      namePrefix: 'interimExemption',
      fieldset: {
        legend: {
          text: 'Date joined scheme',
          classes: 'govuk-fieldset__legend--s'
        }
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2',
          value: dogDetails[`${keys.interimExemption}-day`],
          attributes: { maxlength: '2' }
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2',
          value: dogDetails[`${keys.interimExemption}-month`],
          attributes: { maxlength: '2' }
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4',
          value: dogDetails[`${keys.interimExemption}-year`],
          attributes: { maxlength: '4' }
        }
      ]
    },
    errors: []
  }

  if (errors) {
    for (const error of errors.details) {
      let name = error.path[0]
      const prop = this.model[name]

      if (prop) {
        if (prop.type === 'date') {
          name = addDateErrors(error, prop)
        }

        prop.errorMessage = { text: error.message }
        this.model.errors.push({ text: error.message, href: `#${name}` })
      }
    }
  }
}

module.exports = ViewModel
