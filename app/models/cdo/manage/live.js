const constants = require('../../../constants/cdo')

const baseMap = {
  live: constants.routes.manage.get,
  expired: constants.routes.manageExpired.get,
  due: constants.routes.manageDue.get,
  interim: constants.routes.manageInterim.get
}
/**
 * @param {'live', 'expired', 'due', 'interim'} tab
 * @param {{
 *  column: 'joinedExemptionScheme'
 *  order: 'ASC'|'DESC'
 * }} sort
 * @param {string} column
 * @return {string}
 */
const getAriaSort = (tab, sort, column) => {
  let calculatedColumn = column

  if (column === undefined) {
    calculatedColumn = tab === 'interim' ? 'interimExemptFor' : 'cdoExpiry'
  }

  if (calculatedColumn === sort.column && sort.order === 'DESC') {
    return 'descending'
  }

  if (calculatedColumn === sort.column) {
    return 'ascending'
  }

  return 'none'
}
/**
 * @param {'live', 'expired', 'due', 'interim'} tab
 * @param {{
 *  column: 'joinedExemptionScheme'
 *  order: 'ASC'|'DESC'
 * }} sort
 * @param {string} column
 * @return {string}
 */
const columnLink = (tab, sort, column) => {
  const base = baseMap[tab]
  const queryParams = new URLSearchParams()
  let calculatedColumn = column

  if (column === undefined) {
    calculatedColumn = tab === 'interim' ? 'interimExemptFor' : 'cdoExpiry'
  }

  const defaultSortOrder = calculatedColumn === 'interimExemptFor' ? ['DESC', 'ASC'] : ['ASC', 'DESC']

  if (calculatedColumn !== 'cdoExpiry' && calculatedColumn !== 'interimExemptFor') {
    queryParams.set('sortKey', calculatedColumn)
  }

  if (calculatedColumn === sort.column && sort.order === defaultSortOrder[0]) {
    queryParams.set('sortOrder', defaultSortOrder[1])
  }

  const queryParamsStr = queryParams.toString()
  const queryParamStrWithQM = queryParamsStr.length ? `?${queryParamsStr}` : ''

  return base + queryParamStrWithQM
}
/**
 * @param {SummaryCdo[]} resultList
 * @param {ManageCdoCounts} counts
 * @param {string} tab
 * @param {{ column: string; order: 'ASC'|'DESC'}} sort
 * @param backNav
 * @constructor
 */
function ViewModel (resultList, counts, tab, sort, backNav) {
  const tabs = [
    {
      visible: true,
      active: tab === 'live',
      href: '/cdo/manage',
      label: `Live CDOs (${counts.preExempt.total})`
    },
    {
      visible: true,
      active: tab === 'expired',
      href: '/cdo/manage/expired',
      label: `Expired CDOs (${counts.failed.nonComplianceLetterNotSent})`
    },
    {
      visible: true,
      active: tab === 'due',
      href: '/cdo/manage/due',
      label: `CDOs due within 30 days (${counts.preExempt.within30})`
    }
  ]

  const title = tab === 'interim' ? 'Manage interim exemptions' : 'Manage CDOs'
  let secondaryBtn = {
    label: 'Interim exemptions',
    link: constants.routes.manageInterim.get
  }

  const breadcrumbs = [
    {
      label: 'Home',
      link: '/'
    }
  ]

  if (tab === 'interim') {
    secondaryBtn = {
      label: 'Manage CDOs',
      link: `${constants.routes.manage.get}?noCache=Y`
    }

    breadcrumbs.push({
      label: 'Manage CDOs',
      link: `${constants.routes.manage.get}?noCache=Y`
    })
  }

  const tableHeadings = [
    {
      label: tab === 'interim' ? 'Interim exempt for' : 'CDO expiry',
      link: columnLink(tab, sort, undefined),
      ariaSort: getAriaSort(tab, sort, undefined)
    },
    {
      label: 'Index number',
      link: columnLink(tab, sort, 'indexNumber'),
      ariaSort: getAriaSort(tab, sort, 'indexNumber')
    },
    {
      label: 'Owner',
      link: columnLink(tab, sort, 'owner'),
      ariaSort: getAriaSort(tab, sort, 'owner')
    }

  ]

  if (tab === 'due') {
    tableHeadings.push({
      label: 'Not received',
      link: undefined,
      ariaSort: undefined
    })
  } else {
    tableHeadings.push({
      label: 'Police force',
      link: columnLink(tab, sort, 'policeForce'),
      ariaSort: getAriaSort(tab, sort, 'policeForce')
    })
  }

  const applicationPackProcessed = 'Application pack'
  const insuranceDetailsRecorded = 'Evidence of insurance'
  const applicationFeePaid = 'Application fee'

  const verificationDateRecorded = 'Form 2'

  const taskMapper = {
    applicationPackProcessed,
    insuranceDetailsRecorded,
    applicationFeePaid
  }

  const showList = Object.keys(taskMapper)
  /**
   * @return {(string[], CdoTaskDto) => string}
   * @param {{key: ("applicationPackSent"|"applicationPackProcessed"|"insuranceDetailsRecorded"|"applicationFeePaid"|"form2Sent"|"verificationDateRecorded"), available: boolean, completed: boolean, readonly: boolean, timestamp: (string|undefined)[]} taskList
   */
  const taskListReducer = (tasks, task) => {
    if (task.completed) {
      return tasks
    }

    if (showList.includes(task.key)) {
      return [...tasks, taskMapper[task.key]]
    }

    if (!tasks.length && task.key === 'verificationDateRecorded') {
      return [verificationDateRecorded]
    }

    return tasks
  }

  const resultListMapper = ({ taskList, ...result }) => {
    const notReceived = taskList !== undefined ? taskList.reduce(taskListReducer, []) : []

    return {
      ...result,
      notReceived
    }
  }

  this.model = {
    title,
    breadcrumbs,
    showTabNav: tab !== 'interim',
    secondaryBtn,
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    tableHeadings,
    tab,
    tabs,
    sort: {
      column: 'cdoExpiry',
      order: 'ASC',
      ...sort
    },
    resultList: resultList.map(resultListMapper)
  }
}

module.exports = ViewModel
