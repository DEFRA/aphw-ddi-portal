const { errorPusherWithDate } = require('../../../../lib/error-helpers')
const { constructDateField } = require('../../../../lib/model-helpers')

function ViewModel (data, backNav, errors) {
  this.model = {
    backLink: backNav.backLink === '/' ? `/cdo/manage/cdo/${data.indexNumber}` : backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber: data.indexNumber,
    taskName: data.taskName,
    microchipVerification: constructDateField(data, 'microchipVerification', 'When was the dog\'s microchip number verified?', null, ''),
    neuteringConfirmation: constructDateField(data, 'neuteringConfirmation', 'When was the dog\'s neutering verified?', null, ''),
    errors: []
  }

  errorPusherWithDate(errors, this.model)
}

module.exports = ViewModel
