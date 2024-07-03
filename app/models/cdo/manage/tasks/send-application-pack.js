const { errorPusherDefault } = require('../../../../lib/error-helpers')
function ViewModel (data, backNav, errors) {
  this.model = {
    backLink: backNav.backLink === '/' ? `/cdo/manage/cdo/${data.indexNumber}` : backNav.backLink,
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
          text: 'I have sent the application pack',
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
