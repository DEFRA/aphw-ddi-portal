const { errorPusherWithDate } = require('../../../../lib/error-helpers')
const { constructDateField } = require('../../../../lib/model-helpers')

/**
 * @param {CdoTaskListDto & {indexNumber: string }} data
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
    microchipDeadline: constructDateField(data, 'microchipDeadline', 'When will the dog be fit to be microchipped?', 'Enter the date provided by the vet.', 'govuk-fieldset__legend--l', { fieldset: { legend: { isPageHeading: true } } }),
    errors: []
  }

  errorPusherWithDate(errors, this.model)
}

module.exports = ViewModel
