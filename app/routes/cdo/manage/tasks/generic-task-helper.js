const { tasks } = require('../../../../constants/cdo/index')
const ViewModelSendApplicationPack = require('../../../../models/cdo/manage/tasks/send-application-pack')
const ViewModelRecordInsuranceDetails = require('../../../../models/cdo/manage/tasks/record-insurance-details')
const ViewModelRecordMicrochipNumber = require('../../../../models/cdo/manage/tasks/record-microchip-number')
const ViewModelRecordApplicationFeePayment = require('../../../../models/cdo/manage/tasks/record-application-fee-payment')
const ViewModelSendForm2 = require('../../../../models/cdo/manage/tasks/send-form2')
const ViewModelRecordVerificationDates = require('../../../../models/cdo/manage/tasks/record-verification-dates')
const ViewModelRecordMicrochipDeadline = require('../../../../models/cdo/manage/tasks/record-microchip-deadline')
const { validateSendApplicationPack } = require('../../../../schema/portal/cdo/tasks/send-application-pack')
const { validatePayloadRecordInsuranceDetails } = require('../../../../schema/portal/cdo/tasks/record-insurance-details')
const { validateMicrochipNumber } = require('../../../../schema/portal/cdo/tasks/record-microchip-number')
const { validateApplicationFeePayment } = require('../../../../schema/portal/cdo/tasks/record-application-fee-payment')
const { validateSendForm2 } = require('../../../../schema/portal/cdo/tasks/send-form2')
const { validateVerificationDates } = require('../../../../schema/portal/cdo/tasks/record-verification-dates')
const { getCompanies } = require('../../../../api/ddi-index-api/insurance')
const { getCdoTaskDetails } = require('../../../../api/ddi-index-api/cdo')
const { validateMicrochipDeadlineDates } = require('../../../../schema/portal/cdo/tasks/record-microchip-deadline')

const taskList = [
  { name: tasks.applicationPackSent, Model: ViewModelSendApplicationPack, validation: validateSendApplicationPack, key: 'send-application-pack', label: 'Send application pack', apiKey: 'sendApplicationPack', stateKey: 'applicationPackSent' },
  { name: tasks.insuranceDetailsRecorded, Model: ViewModelRecordInsuranceDetails, validation: validatePayloadRecordInsuranceDetails, key: 'record-insurance-details', label: 'Record insurance details', apiKey: 'recordInsuranceDetails', stateKey: 'insuranceDetailsRecorded' },
  { name: tasks.microchipNumberRecorded, Model: ViewModelRecordMicrochipNumber, validation: validateMicrochipNumber, key: 'record-microchip-number', label: 'Record microchip number', apiKey: 'recordMicrochipNumber', stateKey: 'microchipNumberRecorded' },
  { name: tasks.applicationFeePaid, Model: ViewModelRecordApplicationFeePayment, validation: validateApplicationFeePayment, key: 'record-application-fee-payment', label: 'Record application fee payment', apiKey: 'recordApplicationFee', stateKey: 'applicationFeePaid' },
  { name: tasks.form2Sent, Model: ViewModelSendForm2, validation: validateSendForm2, key: 'send-form2', label: 'Send Form 2', apiKey: 'sendForm2', stateKey: 'form2Sent' },
  { name: tasks.verificationDateRecorded, Model: ViewModelRecordVerificationDates, validation: validateVerificationDates, key: 'record-verification-dates', label: 'Record the verification date for microchip and neutering', apiKey: 'verifyDates', stateKey: 'verificationDateRecorded' },
  { name: tasks.microchipDeadlineRecorded, Model: ViewModelRecordMicrochipDeadline, validation: validateMicrochipDeadlineDates, key: 'record-microchip-deadline', label: 'When will the dog be fit to be microchipped?', apiKey: 'verifyDates', stateKey: 'verificationDateRecorded' }
]

/**
 * @param taskKey
 * @param data
 * @param backNav
 * @param errors
 * @return {*}
 */
const createModel = (taskKey, data, backNav, errors = null) => {
  const task = taskList.find(x => x.key === taskKey)

  if (task === undefined) {
    throw new Error(`Invalid task ${taskKey} when getting model`)
  }

  data.taskName = taskKey

  return new task.Model(data, backNav, errors)
}

const getValidation = payload => {
  const task = taskList.find(x => x.key === payload?.taskName)
  if (task === undefined) {
    throw new Error(`Invalid task ${payload?.taskName} when getting validation`)
  }

  return task.validation(payload)
}

const getTaskDetails = taskName => {
  const task = taskList.find(x => x.name === taskName)
  if (task === undefined) {
    throw new Error(`Invalid task ${taskName} when getting details`)
  }

  return { key: task.key, label: task.label, apiKey: task.apiKey, stateKey: task.stateKey }
}

const getTaskDetailsByKey = taskKey => {
  const task = taskList.find(x => x.key === taskKey)
  if (task === undefined) {
    throw new Error(`Invalid task ${taskKey} when getting details`)
  }

  return { key: task.key, label: task.label, apiKey: task.apiKey, stateKey: task.stateKey }
}

const verificationData = (verificationOptions, payload) => {
  let dogDeclaredUnfit = verificationOptions.dogDeclaredUnfit
  let neuteringBypassedUnder16 = verificationOptions.neuteringBypassedUnder16

  if (Object.keys(payload).length) {
    dogDeclaredUnfit = payload.dogNotFitForMicrochip !== undefined
    neuteringBypassedUnder16 = payload.dogNotNeutered !== undefined
  }

  return {
    ...verificationOptions,
    dogDeclaredUnfit,
    neuteringBypassedUnder16

  }
}

/**
 * @param dogIndex
 * @param taskName
 * @param user
 * @param [payload]
 * @return {Promise<{[p: string]: *}>}
 */
const getTaskData = async (dogIndex, taskName, user, payload = {}) => {
  const taskData = getTaskDetailsByKey(taskName)
  const savedTask = await getCdoTaskDetails(dogIndex, user)
  const taskState = savedTask.tasks[taskData.stateKey]
  const data = { indexNumber: dogIndex, ...savedTask, task: { ...taskState }, ...payload }
  delete data.task.tasks

  if (taskName === 'record-insurance-details') {
    data.companies = await getCompanies(user)
  } else if (taskName === 'record-verification-dates') {
    data.verificationOptions = verificationData(data.verificationOptions, payload)
  }

  return data
}

module.exports = {
  createModel,
  getValidation,
  getTaskData,
  getTaskDetails,
  getTaskDetailsByKey
}
