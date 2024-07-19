const { tasks } = require('../../constants/cdo/index')
const { formatToGds } = require('../../lib/date-helpers')
const { getTaskDetails } = require('../../routes/cdo/manage/tasks/generic-task-helper')

const getTaskStatus = task => {
  if (!task?.available && !task.completed) {
    return 'Cannot start yet'
  }

  return task.completed ? 'Completed' : 'Not yet started'
}

const mapManageCdoDetails = (details, cdo) => {
  const taskNames = Object.keys(details.tasks)
  const taskList = []
  taskNames.forEach(name => {
    if (name !== tasks.certificateIssued) {
      const { key, label } = getTaskDetails(name)
      taskList.push({
        label,
        key,
        status: getTaskStatus(details.tasks[name])
      })
    }
  })
  details.dogIndex = cdo.dog.indexNumber
  details.personReference = cdo.person.personReference
  details.cdoExpiry = formatToGds(cdo.exemption.cdoExpiry)
  details.taskList = taskList.filter(task => task.label)
  return details
}

module.exports = {
  mapManageCdoDetails
}
