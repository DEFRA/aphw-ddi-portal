const { errorPusherWithDate } = require('../../../../lib/error-helpers')
const { constructDateField } = require('../../../../lib/model-helpers')

/**
 * @param {CdoTaskListDto & {indexNumber: string; hidden: unknown }} data
 * @param backNav
 * @param errors
 * @constructor
 */
function ViewModel (data, backNav, errors) {
  this.model = {
    backLink: backNav.backLink === '/' ? `/cdo/manage/cdo/${data.indexNumber}` : backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber: data.indexNumber,
    taskName: data.taskName,
    microchipDeadline: constructDateField(data, 'microchipDeadline', '', 'Enter the date provided by the vet.', '', {}),
    hidden: data.hidden,
    errors: []
  }

  errorPusherWithDate(errors, this.model)
}

module.exports = ViewModel
