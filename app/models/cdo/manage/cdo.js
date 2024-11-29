const constants = require('../../../constants/cdo')
const { mapManageCdoDetails } = require('../../mappers/manage-cdo')
const { tasks } = require('../../../constants/cdo')
const { getTaskDetails } = require('../../../routes/cdo/manage/tasks/generic-task-helper')
const { formatToGdsShort } = require('../../../lib/date-helpers')

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
 * @param {CdoDetails[]} details
 * @param cdo
 * @param backNav
 * @param continueLink
 * @constructor
 */
function ViewModel (details, cdo, backNav, continueLink) {
  const breadcrumbs = [
    {
      label: 'Home',
      link: '/'
    },
    {
      label: 'Manage CDOs',
      link: constants.routes.manage.get
    }
  ]

  const modelDetails = mapManageCdoDetails(details, cdo)

  this.model = {
    breadcrumbs,
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    details: modelDetails,
    taskList:
      Object.keys(details.tasks).reduce((taskListAcc, task) => {
        if (task === tasks.certificateIssued) {
          return taskListAcc
        }
        const { key, label } = getTaskDetails(task)

        const status = getTaskStatus(details.tasks[task])
        const completedDate = formatToGdsShort(getTaskCompletedDate(details.tasks[task]))

        const cannotStart = status === 'Cannot start yet'
        const notYetStarted = status === 'Not yet started'

        const taskProperties = {
          title: {
            text: label
          },
          status: {
            text: status === 'Completed' && completedDate ? `${status} on ${completedDate}` : status,
            classes: cannotStart ? 'defra-secondary-text' : ''
          }
        }

        let queryParams = ''

        if (task === tasks.verificationDateRecorded) {
          const params = backNav.srcHashParam ? '&clear=true' : '?clear=true'
          queryParams += params
        }

        if (status !== 'Cannot start yet') {
          taskProperties.href = `/cdo/manage/task/${key}/${modelDetails.dogIndex}${backNav.srcHashParam}${queryParams}`
        }

        if (notYetStarted) {
          taskProperties.status = {
            tag: {
              text: status,
              classes: 'govuk-tag--blue'
            }
          }
        }

        return {
          ...taskListAcc,
          items: [
            ...taskListAcc.items,
            taskProperties
          ]
        }
      }, {
        items: []
      }),
    continueLink
  }
}

module.exports = ViewModel
