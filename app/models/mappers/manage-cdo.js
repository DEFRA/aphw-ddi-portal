const { tasks } = require('../../constants/cdo/index')
const { formatToGds, formatToGdsShort } = require('../../lib/date-helpers')
const { getTaskDetails } = require('../../routes/cdo/manage/tasks/generic-task-helper')

const getTaskStatus = task => {
  if (!task?.available && !task.completed) {
    return 'Cannot start yet'
  }

  return task.completed ? 'Completed' : 'Not yet started'
}

const getTaskCompletedDate = task => {
  return task.completed ? task.timestamp : undefined
}

/**
 * @param {CdoTaskListDto} details
 * @param cdo
 * @return {{summary: {microchipNumber, microchipNumber2, ownerName: string, dogName: string, cdoExpiry: (Date|undefined)}, dogIndex: *, taskList: *[], personReference: *, cdoExpiry: (*|string)}}
 */
const mapManageCdoDetails = (details, cdo) => {
  const taskNames = Object.keys(details.tasks)
  const taskList = []
  taskNames.forEach(name => {
    if (name !== tasks.certificateIssued) {
      const { key, label } = getTaskDetails(name)
      taskList.push({
        label,
        key,
        status: getTaskStatus(details.tasks[name]),
        completedDate: formatToGdsShort(getTaskCompletedDate(details.tasks[name]))
      })
    }
  })
  const dogIndex = cdo.dog.indexNumber
  const personReference = cdo.person.personReference
  const cdoExpiry = formatToGds(cdo.exemption.cdoExpiry)
  const summary = {
    dogName: details.cdoSummary.dog.name,
    ownerName: [details.cdoSummary.person.firstName, details.cdoSummary.person.lastName].filter(Boolean).join(' '),
    microchipNumber: details.microchipNumber,
    microchipNumber2: details.microchipNumber2,
    cdoExpiry: details.cdoSummary.exemption.cdoExpiry
  }

  return {
    ...details,
    dogIndex,
    personReference,
    cdoExpiry,
    taskList: taskList.filter(task => task.label),
    summary
  }
}

module.exports = {
  mapManageCdoDetails
}
