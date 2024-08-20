const { errorPusherDefault } = require('../../../../lib/error-helpers')

function ViewModel (data, backNav, errors) {
  this.model = {
    backLink: backNav.backLink === '/' ? `/cdo/manage/cdo/${data.indexNumber}` : backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber: data.indexNumber,
    taskName: data.taskName,
    microchipNumber: {
      id: 'microchipNumber',
      name: 'microchipNumber',
      label: {
        text: 'Record microchip number',
        isPageHeading: true,
        classes: 'govuk-label--l govuk-!-margin-bottom-5'
      },
      classes: 'govuk-input--width-10',
      value: data.microchipNumber,
      attributes: { maxlength: '20' }
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
