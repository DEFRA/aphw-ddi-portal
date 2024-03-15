const { keys } = require('../../../../constants/cdo/dog')

const applicationTypeElements = (dogDetails) => {
  return {
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
    }
  }
}

module.exports = {
  applicationTypeElements
}
