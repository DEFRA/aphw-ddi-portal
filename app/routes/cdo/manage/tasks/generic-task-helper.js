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

const taskNames = [
  { taskName: tasks.sendApplicationPack, Model: ViewModel1, validation: validateSendApplicationPack },
  { taskName: tasks.recordInsuranceDetails, Model: ViewModel2, validation: validatePayloadRecordInsuranceDetails },
  { taskName: tasks.recordMicrochipNumber, Model: ViewModel3, validation: validateMicrochipNumber },
  { taskName: tasks.recordApplicationFeePayment, Model: ViewModel4, validation: validateApplicationFeePayment },
  { taskName: tasks.sendForm2, Model: ViewModel5, validation: validateSendForm2 },
  { taskName: tasks.recordVerificationDates, Model: ViewModel6, validation: validateVerificationDates }
]

const createModel = (taskName, data, backNav, errors = null) => {
  const task = taskNames.find(x => x.taskName === taskName)
  if (task === undefined) {
    throw new Error(`Invalid task ${taskName} when getting model`)
  }

  data.taskName = taskName

  return new task.Model(data, backNav, errors)
}

const getValidation = payload => {
  const task = taskNames.find(x => x.taskName === payload?.taskName)
  if (task === undefined) {
    throw new Error(`Invalid task ${payload?.taskName} when getting validation`)
  }

  return task.validation(payload)
}

const getTaskData = async (dogIndex, taskName) => {
  const savedTask = await getCdoTaskDetails(dogIndex, taskName)
  return await getTaskPayloadData(dogIndex, taskName, savedTask)
}

const getTaskPayloadData = async (dogIndex, taskName, payload) => {
  const data = { indexNumber: dogIndex, ...payload }

  if (taskName === tasks.recordInsuranceDetails) {
    data.companies = await getCompanies()
  }

  return data
}

module.exports = {
  createModel,
  getValidation,
  getTaskData,
  getTaskPayloadData
}
