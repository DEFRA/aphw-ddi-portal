const unavailableTask = {
  available: false,
  completed: false,
  readonly: false
}

/**
 * @param {Partial<CdoTaskDto> & { key: string }} taskListPartial
 * @return {CdoTaskDto}
 */
const buildTask = taskListPartial => ({
  ...unavailableTask,
  ...taskListPartial
})

/**
 * @param {Partial<CdoTaskListTasksDto>} tasksPartial
 * @return {CdoTaskListTasksDto}
 */
const buildTaskListTasks = (tasksPartial = {}) => ({
  applicationPackSent: buildTask({
    key: 'applicationPackSent',
    available: true
  }),
  insuranceDetailsRecorded: buildTask({
    key: 'insuranceDetailsRecorded'
  }),
  microchipNumberRecorded: buildTask({
    key: 'microchipNumberRecorded'
  }),
  applicationFeePaid: buildTask({
    key: 'applicationFeePaid'
  }),
  form2Sent: buildTask({
    key: 'form2Sent'
  }),
  verificationDateRecorded: buildTask({
    key: 'verificationDateRecorded'
  }),
  certificateIssued: buildTask({
    key: 'certificateIssued'
  }),
  ...tasksPartial
})

/**
 * @param {Partial<CdoSummary>} cdoSummaryPartial
 * @return {CdoSummary}
 */
const buildCdoSummary = (cdoSummaryPartial = {}) => ({
  dog: {
    name: 'Rex300'
  },
  person: {
    firstName: 'Alex',
    lastName: 'Carter'
  },
  exemption: {
    cdoExpiry: new Date('2023-12-10')
  },
  ...cdoSummaryPartial
})

/**
 * @param {Partial<CdoVerificationOptions>} verificationOptionsPartial
 * @return {CdoVerificationOptions}
 */
const buildVerificationOptions = (verificationOptionsPartial = {}) => ({
  dogDeclaredUnfit: false,
  neuteringBypassedUnder16: false,
  allowDogDeclaredUnfit: false,
  allowNeuteringBypass: false,
  showNeuteringBypass: false,
  ...verificationOptionsPartial
})

/**
 * @type {Partial<CdoTaskListDto>}
 */
const initialTaskList = {
  tasks: buildTaskListTasks(),
  verificationOptions: buildVerificationOptions(),
  cdoSummary: buildCdoSummary()
}

/**
 * @param {Partial<CdoTaskListDto>} [buildTaskListPartial]
 * @return {CdoTaskListDto}
 */
const buildTaskListFromInitial = (buildTaskListPartial = {}) => ({
  ...initialTaskList,
  ...buildTaskListPartial
})

/**
 * @param {Partial<CdoTaskListTasksDto>} [tasksPartial]
 * @return {CdoTaskListTasksDto}
 */
const buildTaskListTasksFromComplete = (tasksPartial = {}) => ({
  applicationPackSent: {
    key: 'applicationPackSent',
    available: true,
    completed: true,
    readonly: true,
    timestamp: '2024-11-27T00:00:00.000Z'
  },
  insuranceDetailsRecorded: {
    key: 'insuranceDetailsRecorded',
    available: true,
    completed: true,
    readonly: false,
    timestamp: '2024-11-27T00:00:00.000Z'
  },
  microchipNumberRecorded: {
    key: 'microchipNumberRecorded',
    available: true,
    completed: true,
    readonly: false,
    timestamp: '2024-11-27T00:00:00.000Z'
  },
  applicationFeePaid: {
    key: 'applicationFeePaid',
    available: true,
    completed: true,
    readonly: false,
    timestamp: '2024-11-27T00:00:00.000Z'
  },
  form2Sent: {
    key: 'form2Sent',
    available: true,
    completed: true,
    readonly: true,
    timestamp: '2024-11-27T00:00:00.000Z'
  },
  verificationDateRecorded: {
    key: 'verificationDateRecorded',
    available: true,
    completed: true,
    readonly: false,
    timestamp: '2024-11-27T00:00:00.000Z'
  },
  certificateIssued: {
    key: 'certificateIssued',
    available: true,
    completed: true,
    readonly: false,
    timestamp: '2024-11-27T00:00:00.000Z'
  },
  ...tasksPartial
})

/**
 * @type {CdoTaskListDto}
 */
const completeTasklist = {
  tasks: buildTaskListTasksFromComplete(),
  verificationOptions: buildVerificationOptions(),
  applicationPackSent: '2024-11-27T00:00:00.000Z',
  insuranceCompany: 'Dog\'s Trust',
  insuranceRenewal: '2025-01-01T00:00:00.000Z',
  microchipNumber: '123456789012354',
  applicationFeePaid: '2024-01-01T00:00:00.000Z',
  form2Sent: '2024-11-27T00:00:00.000Z',
  cdoSummary: buildCdoSummary()
}

/**
 * @param {Partial<CdoTaskListDto>} tasklistPartial
 * @return {CdoTaskListDto}
 */
const buildTaskListFromComplete = tasklistPartial => ({
  ...completeTasklist,
  ...tasklistPartial
})

const buildVerificationPayload = verificationPayloadPartial => ({
  neuteringConfirmation: { year: '', month: '', date: '' },
  microchipVerification: { year: '', month: '', date: '' },
  dogNotNeutered: false,
  dogNotFitForMicrochip: false,
  ...verificationPayloadPartial
})

module.exports = {
  buildCdoSummary,
  buildTask,
  buildTaskListFromInitial,
  buildTaskListFromComplete,
  buildTaskListTasks,
  buildTaskListTasksFromComplete,
  buildVerificationOptions,
  buildVerificationPayload
}
