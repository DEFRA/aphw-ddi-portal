const { errorPusherWithDate } = require('../../../../lib/error-helpers')
const { constructDateField } = require('../../../../lib/model-helpers')

function ViewModel (data, backNav, errors) {
  this.model = {
    backLink: backNav.backLink === '/' ? `/cdo/manage/cdo/${data.indexNumber}` : backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber: data.indexNumber,
    taskName: data.taskName,
    applicationFeePaid: constructDateField(data, 'applicationFeePaid', 'Record application fee payment', 'When was the application fee paid?', '', { fieldset: { legend: { isPageHeading: true, classes: 'govuk-fieldset__legend--l govuk-!-margin-bottom-6' } } }),
    errors: []
  }

  errorPusherWithDate(errors, this.model)
}

module.exports = ViewModel
