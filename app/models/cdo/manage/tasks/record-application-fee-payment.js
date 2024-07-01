const { errorPusherWithDate } = require('../../../../lib/error-helpers')
const { constructDateField } = require('../../../../lib/model-helpers')

function ViewModel (data, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber: data.indexNumber,
    taskName: data.taskName,
    applicationFeePaid: constructDateField(data, 'applicationFeePaid', null, 'When was the application fee paid?'),
    errors: []
  }

  errorPusherWithDate(errors, this.model)
}

module.exports = ViewModel
