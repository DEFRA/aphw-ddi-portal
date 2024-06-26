const { tasks } = require('../../../../constants/cdo/index')
const ViewModel1 = require('../../../../models/cdo/manage/tasks/send-application-pack')
const ViewModel2 = require('../../../../models/cdo/manage/tasks/record-insurance-details')
const ViewModel3 = require('../../../../models/cdo/manage/tasks/record-microchip-number')
const ViewModel4 = require('../../../../models/cdo/manage/tasks/record-application-fee-payment')
const ViewModel5 = require('../../../../models/cdo/manage/tasks/send-form2')
const ViewModel6 = require('../../../../models/cdo/manage/tasks/record-verification-dates')
const { validateSendApplicationPack } = require('../../../../schema/portal/cdo/tasks/send-application-pack')
const { validatePayloadRecordInsuranceDetails } = require('../../../../schema/portal/cdo/tasks/record-insurance-details')
const { validateMicrochipNumber } = require('../../../../schema/portal/cdo/tasks/record-microchip-number')
const { validateApplicationFeePayment } = require('../../../../schema/portal/cdo/tasks/record-application-fee-payment')
const { validateSendForm2 } = require('../../../../schema/portal/cdo/tasks/send-form2')
const { validateVerificationDates } = require('../../../../schema/portal/cdo/tasks/record-verification-dates')
const { getCompanies } = require('../../../../api/ddi-index-api/insurance')
const { getCdoTaskDetails } = require('../../../../api/ddi-index-api/cdo')

const taskList = [
  { name: tasks.applicationPackSent, Model: ViewModel1, validation: validateSendApplicationPack, key: 'send-application-pack', label: 'Send application pack' },
  { name: tasks.insuranceDetailsRecorded, Model: ViewModel2, validation: validatePayloadRecordInsuranceDetails, key: 'record-insurance-details', label: 'Record insurance details' },
  { name: tasks.microchipNumberRecorded, Model: ViewModel3, validation: validateMicrochipNumber, key: 'record-microchip-number', label: 'Record microchip number' },
  { name: tasks.applicationFeePaid, Model: ViewModel4, validation: validateApplicationFeePayment, key: 'record-application-fee-payment', label: 'Record application fee payment' },
  { name: tasks.form2Sent, Model: ViewModel5, validation: validateSendForm2, key: 'send-form2', label: 'Send Form 2' },
  { name: tasks.verificationDateRecorded, Model: ViewModel6, validation: validateVerificationDates, key: 'record-verification-dates', label: 'Record the verification date for microchip and neutering' }
]

const createModel = (taskName, data, backNav, errors = null) => {
  const task = taskList.find(x => x.key === taskName)
  if (task === undefined) {
    throw new Error(`Invalid task ${taskName} when getting model`)
  }

  data.taskName = taskName

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

  return { key: task.key, label: task.label }
}

const getTaskData = async (dogIndex, taskName) => {
  const savedTask = await getCdoTaskDetails(dogIndex, taskName)
  return await getTaskPayloadData(dogIndex, taskName, savedTask)
}

const getTaskPayloadData = async (dogIndex, taskName, payload) => {
  const data = { indexNumber: dogIndex, ...payload }

  if (taskName === 'record-insurance-details') {
    data.companies = await getCompanies()
  }

  return data
}

module.exports = {
  createModel,
  getValidation,
  getTaskData,
  getTaskPayloadData,
  getTaskDetails
}