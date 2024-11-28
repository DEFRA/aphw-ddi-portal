const unavailableTask = {
  available: false,
  completed: false,
  readonly: false
}

/**
 * @param {Partial<TaskItem> & { key: string }} taskListPartial
 * @return {TaskItem}
 */
const buildTask = taskListPartial => ({
  ...unavailableTask,
  ...taskListPartial
})

/**
 * @param {Partial<TasklistTasks>} tasksPartial
 * @return {TasklistTasks}
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
 * @param {Partial<TaskListVerificationOptions>} verificationOptionsPartial
 * @return {TaskListVerificationOptions}
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
 * @type {Partial<TaskList>}
 */
const initialTaskList = {
  tasks: buildTaskListTasks(),
  verificationOptions: buildVerificationOptions()
}

/**
 * @param {Partial<TaskList>} [buildTaskListPartial]
 * @return {TaskList}
 */
const buildTaskListFromInitial = (buildTaskListPartial = {}) => ({
  ...initialTaskList,
  ...buildTaskListPartial
})

/**
 * @param {Partial<TasklistTasks>} [tasksPartial]
 * @return {TasklistTasks}
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
 * @type {TaskList}
 */
const completeTasklist = {
  tasks: buildTaskListTasksFromComplete(),
  verificationOptions: buildVerificationOptions(),
  applicationPackSent: '2024-11-27T00:00:00.000Z',
  insuranceCompany: 'Dog\'s Trust',
  insuranceRenewal: '2025-01-01T00:00:00.000Z',
  microchipNumber: '123456789012354',
  applicationFeePaid: '2024-01-01T00:00:00.000Z',
  form2Sent: '2024-11-27T00:00:00.000Z'
}

/**
 * @param {Partial<TaskList>} tasklistPartial
 * @return {TaskList}
 */
const buildTaskListFromComplete = tasklistPartial => ({
  ...completeTasklist,
  ...tasklistPartial
})

module.exports = {
  buildTask,
  buildTaskListFromInitial,
  buildTaskListFromComplete,
  buildTaskListTasks,
  buildTaskListTasksFromComplete,
  buildVerificationOptions
}
