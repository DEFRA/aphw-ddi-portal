const { errorPusherDefault } = require('../../../../lib/error-helpers')
function ViewModel (data, backNav, errors) {
  const backLink = backNav.backLink === '/' ? `/cdo/manage/cdo/${data.indexNumber}` : backNav.backLink
  this.model = {
    backLink,
    continueLink: backLink + '?action=continue',
    srcHashParam: backNav.srcHashParam,
    indexNumber: data.indexNumber,
    taskName: data.taskName,
    disabled: data.task.completed,
    taskDone: {
      id: 'taskDone',
      name: 'taskDone',
      items: [
        {
          value: 'Y',
          text: 'I have processed the application',
          checked: data.task.completed,
          disabled: data.task.completed
        }
      ]
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
