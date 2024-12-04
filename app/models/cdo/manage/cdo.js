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

const showValOrNotEntered = val => val || '<span class="defra-secondary-text">Not entered</span>'
const showValOrNotEnteredObj = val => val ? ({ text: val }) : ({ html: showValOrNotEntered(val) })
/**
 * @param {CdoTaskListDto} tasklist
 * @param cdo
 * @param backNav
 * @param continueLink
 * @constructor
 */
function ViewModel (tasklist, cdo, backNav, continueLink) {
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

  const modelDetails = mapManageCdoDetails(tasklist, cdo)

  /**
   * @type {GovukSummaryList[]}
   */
  const summaries = [
    {
      classes: 'defra-responsive-!-font-size-16',
      rows: [
        {
          key: {
            text: 'Dog name',
            classes: 'govuk-!-width-one-half'
          },
          value: showValOrNotEnteredObj(modelDetails.summary.dogName)
        },
        {
          key: {
            text: 'Owner name',
            classes: 'govuk-!-width-one-half'
          },
          value: showValOrNotEnteredObj(modelDetails.summary.ownerName)
        }
      ]
    },
    {
      classes: 'defra-responsive-!-font-size-16',
      rows: [
        {
          key: {
            text: 'Microchip number',
            classes: 'govuk-!-width-one-half'
          },
          value: {
            html: [showValOrNotEntered(modelDetails.summary.microchipNumber), modelDetails.summary.microchipNumber2].join('<br>'),
            classes: 'govuk-!-width-one-half'
          }
        },
        {
          key: {
            text: 'CDO expiry',
            classes: 'govuk-!-width-one-half'
          },
          value: {
            text: formatToGdsShort(modelDetails.summary.cdoExpiry),
            classes: 'govuk-!-width-one-half'
          }
        }
      ]
    }
  ]

  this.model = {
    breadcrumbs,
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    details: modelDetails,
    dog: cdo.dog,
    summaries,
    taskList:
      Object.keys(tasklist.tasks).reduce((taskListAcc, task) => {
        if (task === tasks.certificateIssued) {
          return taskListAcc
        }
        const { key, label } = getTaskDetails(task)

        const status = getTaskStatus(tasklist.tasks[task])
        const completedDate = formatToGdsShort(getTaskCompletedDate(tasklist.tasks[task]))

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
