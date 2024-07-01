const { errorPusherWithDate } = require('../../../../lib/error-helpers')
const { constructDateField } = require('../../../../lib/model-helpers')

function ViewModel (data, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber: data.indexNumber,
    taskName: data.taskName,
    microchipVerified: constructDateField(data, 'microchipVerified', 'When was the dog\'s microchip number verified?', null, ''),
    neuteringVerified: constructDateField(data, 'neuteringVerified', 'When was the dog\'s neutering verified?', null, ''),
    errors: []
  }

  errorPusherWithDate(errors, this.model)
}

module.exports = ViewModel
