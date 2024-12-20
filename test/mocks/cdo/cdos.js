/**
 * @param total
 * @param within30
 * @param nonComplianceLetterNotSent
 * @return {{preExempt: {total: number, within30: number}, failed: {nonComplianceLetterNotSent: number}}}
 */
const buildCdoCounts = ({
  total,
  within30,
  nonComplianceLetterNotSent
}) => ({
  preExempt: {
    total: total ?? 0,
    within30: within30 ?? 0
  },
  failed: {
    nonComplianceLetterNotSent: nonComplianceLetterNotSent ?? 0
  }
})
/**
 * @typedef CdoTaskDto
 * @property {'applicationPackSent' | 'applicationPackProcessed' | 'insuranceDetailsRecorded' | 'applicationFeePaid' | 'form2Sent' | 'verificationDateRecorded'} key
 * @property {boolean} available
 * @property {boolean} completed
 * @property {boolean} readonly
 * @property {string|undefined} timestamp
 */
/**
 * @param {Partial<CdoTaskDto>} summaryTaskPartial
 * @return {CdoTaskDto}
 */
const buildSummaryTask = (summaryTaskPartial = {}) => ({
  key: 'applicationPackSent',
  completed: false,
  readonly: false,
  timestamp: undefined,
  available: false,
  ...summaryTaskPartial
})

/**
 * @param {{
 *    applicationPackSent?: Partial<CdoTaskDto>
 *    applicationPackProcessed?: Partial<CdoTaskDto>
 *    insuranceDetailsRecorded?: Partial<CdoTaskDto>
 *    applicationFeePaid?: Partial<CdoTaskDto>
 *    form2Sent?: Partial<CdoTaskDto>
 *    verificationDateRecorded?: Partial<CdoTaskDto>
 * }} summaryTaskList
 * @return {{key: ("applicationPackSent"|"applicationPackProcessed"|"insuranceDetailsRecorded"|"applicationFeePaid"|"form2Sent"|"verificationDateRecorded"), available: boolean, completed: boolean, readonly: boolean, timestamp: (string|undefined)}[]}
 */
const buildSummaryTaskList = (summaryTaskList) => [
  buildSummaryTask({
    key: 'applicationPackSent',
    available: true,
    completed: true,
    readonly: true,
    timestamp: '2024-12-19T00:00:00.000Z',
    ...summaryTaskList?.applicationPackSent
  }),
  buildSummaryTask({
    key: 'applicationPackProcessed',
    available: true,
    completed: true,
    readonly: true,
    timestamp: '2024-12-19T00:00:00.000Z',
    ...summaryTaskList?.applicationPackProcessed
  }),
  buildSummaryTask({
    key: 'insuranceDetailsRecorded',
    available: true,
    ...summaryTaskList?.insuranceDetailsRecorded
  }),
  buildSummaryTask({
    key: 'applicationFeePaid',
    available: true,
    ...summaryTaskList?.applicationFeePaid
  }),
  buildSummaryTask({
    key: 'form2Sent',
    available: true,
    completed: true,
    readonly: true,
    timestamp: '2024-12-19T00:00:00.000Z',
    ...summaryTaskList?.form2Sent
  }),
  buildSummaryTask({
    key: 'verificationDateRecorded',
    completed: false,
    available: true,
    ...summaryTaskList?.verificationDateRecorded
  })
]

const buildSummaryTaskListFromStart = (summaryTaskList) => [
  buildSummaryTask({
    key: 'applicationPackSent',
    available: true,
    ...summaryTaskList?.applicationPackSent
  }),
  buildSummaryTask({
    key: 'applicationPackProcessed',
    ...summaryTaskList?.applicationPackProcessed
  }),
  buildSummaryTask({
    key: 'insuranceDetailsRecorded',
    ...summaryTaskList?.insuranceDetailsRecorded
  }),
  buildSummaryTask({
    key: 'applicationFeePaid',
    ...summaryTaskList?.applicationFeePaid
  }),
  buildSummaryTask({
    key: 'form2Sent',
    ...summaryTaskList?.form2Sent
  }),
  buildSummaryTask({
    key: 'verificationDateRecorded',
    ...summaryTaskList?.verificationDateRecorded
  })
]

const buildSummaryCdosApiResponse = cdosPartial => {
  const count = cdosPartial?.cdos?.length ?? 0

  return {
    cdos: [],
    count,
    counts: {
      preExempt: {
        total: 0,
        within30: 0
      },
      failed: {
        nonComplianceLetterNotSent: 0
      }
    },
    ...cdosPartial
  }
}

const buildSummaryCdoResponse = partialResponse => {
  return {
    cdos: [],
    counts: {
      preExempt: {
        total: 0,
        within30: 0
      },
      failed: {
        nonComplianceLetterNotSent: 0
      }
    },
    ...partialResponse
  }
}

const buildSummaryCdo = partialSummaryCdo => {
  return {
    id: 400153,
    index: 'ED400153',
    owner: 'Sherlock Holmes',
    personReference: 'P-5241-15E2',
    policeForce: 'Metropolitan Police Service',
    status: 'Pre-exempt',
    cdoExpiry: '2024-12-31T00:00:00.000Z',
    humanReadableCdoExpiry: '31 December 2024',
    joinedExemptionScheme: null,
    interimExemptFor: null,
    taskList: buildSummaryTaskListFromStart({}),
    ...partialSummaryCdo
  }
}

module.exports = {
  buildSummaryCdo,
  buildCdoCounts,
  buildSummaryCdosApiResponse,
  buildSummaryCdoResponse,
  buildSummaryTaskList
}
