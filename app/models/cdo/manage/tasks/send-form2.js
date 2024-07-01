const { errorPusherDefault } = require('../../../../lib/error-helpers')

function ViewModel (data, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber: data.indexNumber,
    taskName: data.taskName,
    taskDone: {
      id: 'taskDone',
      name: 'taskDone',
      items: [
        {
          value: 'Y',
          text: 'I have sent the Form 2'
        }
      ]
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
